const MAX_KEY_LENGTH = 256;
const OBJECT_KEY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export function isValidObjectKey(key: string): boolean {
  return key.length <= MAX_KEY_LENGTH && OBJECT_KEY_PATTERN.test(key);
}

// SVG is deliberately absent: it can carry script and is served from a public domain.
const UPLOAD_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

export function createUploadFileName(mimeType: string): string | null {
  const extension = UPLOAD_EXTENSIONS[mimeType];
  if (!extension) return null;
  return `${Date.now()}-${crypto.randomUUID()}.${extension}`;
}

// RFC 5987 attr-char; every other byte of the UTF-8 encoding is percent-escaped.
const ATTR_CHAR = /^[A-Za-z0-9!\#$&+.^_`|~-]$/;

export function attachmentDisposition(fileName: string): string {
  let extended = "";
  for (const byte of new TextEncoder().encode(fileName)) {
    const char = String.fromCharCode(byte);
    const escaped = ATTR_CHAR.test(char)
      ? char
      : `%${byte.toString(16).toUpperCase().padStart(2, "0")}`;
    extended += escaped;
  }

  const fallback = fileName
    .replace(/["\\\r\n]/g, "")
    .replace(/[^\x20-\x7E]/g, "");

  return `attachment; filename="${fallback}"; filename*=UTF-8''${extended}`;
}
