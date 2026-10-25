import { env } from "cloudflare:workers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readResult } from "../../tests/helpers/route";
import type { Route } from "./+types/api.upload";
import { action } from "./api.upload";

// The action only ever calls `send`, so replacing the client factory keeps the test
// away from the real S3 SDK (and the ~900 kB module graph it pulls in).
const send = vi.hoisted(() => vi.fn().mockResolvedValue({}));

vi.mock("~/lib/r2/client", () => ({
  createR2Client: () => ({ send }),
}));

const MAX_BYTES = 5 * 1024 * 1024;

function uploadRequest(file: File | null) {
  const body = new FormData();
  if (file) body.set("file", file);

  // happy-dom's Request does not parse multipart bodies, and the action only needs
  // `formData()`, so the double stops there.
  return { formData: async () => body } as unknown as Request;
}

function argsFor(request: Request): Route.ActionArgs {
  return { request } as unknown as Route.ActionArgs;
}

function fileOf(bytes: number, type: string): File {
  return new File([new Uint8Array(bytes)], "report.pdf", { type });
}

describe("upload action", () => {
  beforeEach(() => {
    env.CLOUDFLARE_ACCOUNT_ID = "acct";
    env.R2_ACCESS_KEY_ID = "access";
    env.R2_SECRET_ACCESS_KEY = "secret";
    env.R2_BUCKET_NAME = "uploads-bucket";
  });

  afterEach(() => {
    // `env` is typed as the Worker's binding record, which has no index signature;
    // the test double behind it is a plain object.
    for (const key of Object.keys(env)) {
      delete (env as unknown as Record<string, string>)[key];
    }
  });

  it("rejects a request with no file part", async () => {
    const result = await readResult(await action(argsFor(uploadRequest(null))));

    expect(result.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a file over the size cap without reading it", async () => {
    const oversized = fileOf(MAX_BYTES + 1, "image/png");

    const result = await readResult(
      await action(argsFor(uploadRequest(oversized))),
    );

    expect(result.status).toBe(413);
    expect(result.body).toEqual({ error: "File exceeds the 5 MB limit" });
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a mime type outside the allow-list", async () => {
    // SVG is the interesting case: it is an image, but it can carry script.
    const sneaky = fileOf(128, "image/svg+xml");

    const result = await readResult(
      await action(argsFor(uploadRequest(sneaky))),
    );

    expect(result.status).toBe(415);
    expect(send).not.toHaveBeenCalled();
  });

  it("stores an allowed file under a generated name, not the client's", async () => {
    env.R2_PUBLIC_DOMAIN = "pub-acct.r2.dev";
    const png = fileOf(1024, "image/png");

    const result = await readResult(await action(argsFor(uploadRequest(png))));

    expect(result.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);

    const command = send.mock.calls[0]?.[0] as {
      input?: { Bucket?: string; Key?: string; ContentType?: string };
    };
    const key = command.input?.Key ?? "";

    expect(command.input?.Bucket).toBe("uploads-bucket");
    expect(command.input?.ContentType).toBe("image/png");
    expect(key).toMatch(/^uploads\/\d+-[0-9a-f-]{36}\.png$/);
    expect(result.body).toMatchObject({
      success: true,
      url: `https://pub-acct.r2.dev/${key}`,
    });
  });

  it("fails closed when the object store rejects the write", async () => {
    send.mockRejectedValueOnce(new Error("AccessDenied"));
    const png = fileOf(1024, "image/png");

    const result = await readResult(await action(argsFor(uploadRequest(png))));

    expect(result.status).toBe(500);
    expect(result.body).toEqual({ error: "Upload failed" });
  });
});
