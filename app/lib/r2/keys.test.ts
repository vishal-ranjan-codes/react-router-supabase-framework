import { describe, expect, it } from "vitest";
import {
  attachmentDisposition,
  createUploadFileName,
  isValidObjectKey,
} from "./keys";

describe("isValidObjectKey", () => {
  it("accepts a generated upload name", () => {
    expect(
      isValidObjectKey(
        "1700000000000-2f7f6a2e-3d0a-4a1e-9b8c-1a2b3c4d5e6f.png",
      ),
    ).toBe(true);
  });

  it.each([
    ["", "empty"],
    [".env", "leading dot"],
    ["../secret", "parent traversal"],
    ["a/b", "path separator"],
    ["a\\b", "backslash"],
    ["a\x00b", "nul byte"],
    ["a b", "space"],
    ['a"b', "quote"],
    ["a;b", "semicolon"],
    ["x".repeat(257), "over the length cap"],
  ])("rejects %j (%s)", (key) => {
    expect(isValidObjectKey(key)).toBe(false);
  });
});

describe("createUploadFileName", () => {
  it("derives the name from the mime type, never the client file name", () => {
    const fileName = createUploadFileName("image/png") ?? "";

    expect(fileName).toMatch(/^\d+-[0-9a-f]{8}-.{27}\.png$/);
  });

  it.each([
    ["image/jpeg", "jpg"],
    ["image/webp", "webp"],
    ["image/gif", "gif"],
    ["application/pdf", "pdf"],
  ])("maps %s to .%s", (mime, extension) => {
    const fileName = createUploadFileName(mime) ?? "";

    expect(fileName).toMatch(new RegExp(`\\.${extension}$`));
  });

  it.each([
    ["image/svg+xml"],
    ["application/x-sh"],
    ["text/html"],
    [""],
    ["application/octet-stream"],
  ])("refuses %s", (mime) => {
    expect(createUploadFileName(mime)).toBeNull();
  });

  it("gives every call a distinct name", () => {
    const names = new Set(
      Array.from({ length: 20 }, () => createUploadFileName("image/png")),
    );

    expect(names.size).toBe(20);
  });
});

describe("attachmentDisposition", () => {
  it("keeps a validated ascii name readable in both forms", () => {
    expect(attachmentDisposition("report.pdf")).toBe(
      `attachment; filename="report.pdf"; filename*=UTF-8''report.pdf`,
    );
  });

  it("percent-escapes non-ascii bytes in filename*", () => {
    expect(attachmentDisposition("résumé.pdf")).toContain(
      "filename*=UTF-8''r%C3%A9sum%C3%A9.pdf",
    );
  });

  it("strips header-injection characters from the ascii fallback", () => {
    const header = attachmentDisposition('a".pdf\r\nX-Injected: 1\\');

    expect(header).not.toContain("\r");
    expect(header).not.toContain("\n");
    expect(header).toContain('filename="a.pdfX-Injected: 1"');
  });
});
