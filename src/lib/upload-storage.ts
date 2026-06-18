import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";

export const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
export const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "application/octet-stream",
];
export const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "gif", "heic", "heif"];

export function resolveBlobToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return process.env.BLOB_READ_WRITE_TOKEN;
  }
  for (const [key, value] of Object.entries(process.env)) {
    if (key.endsWith("_READ_WRITE_TOKEN") && value) {
      return value;
    }
  }
  return undefined;
}

/** Vercel'de Blob, yerelde dosya sistemi (token varsa yerelde de Blob denenebilir) */
export function shouldUseBlobStorage(): boolean {
  if (process.env.VERCEL === "1") {
    return true;
  }
  return Boolean(resolveBlobToken());
}

export function validateUploadFile(
  file: File
): { ok: true; ext: string; contentType: string } | { ok: false; error: string } {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const typeOk = !file.type || ALLOWED_TYPES.includes(file.type);
  const extOk = ALLOWED_EXT.includes(ext);

  if (!typeOk && !extOk) {
    return { ok: false, error: "Sadece JPG, PNG, WEBP veya GIF yüklenebilir" };
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    return { ok: false, error: "Dosya boyutu 10 MB'dan küçük olmalı" };
  }
  if (file.size === 0) {
    return { ok: false, error: "Boş dosya yüklenemez" };
  }

  const safeExt = extOk ? ext : "jpg";
  const contentType = file.type || `image/${safeExt === "jpg" ? "jpeg" : safeExt}`;
  return { ok: true, ext: safeExt, contentType };
}

export function uploadErrorMessage(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  if (message.includes("access") || message.includes("Access")) {
    return "Blob depolama erişim hatası. Vercel Storage ayarlarını kontrol edin.";
  }
  if (
    message.includes("token") ||
    message.includes("Token") ||
    message.includes("No token found") ||
    message.includes("BLOB_READ_WRITE_TOKEN")
  ) {
    return "Vercel Blob Storage bağlı değil. Vercel panelinde Storage → Blob store ekleyip Redeploy yapın.";
  }
  if (message.includes("ENOENT") || message.includes("EACCES")) {
    return "Dosya kaydedilemedi. uploads klasörü yazılabilir olmalı.";
  }
  if (message.includes("Body exceeded") || message.includes("too large")) {
    return "Dosya çok büyük. 10 MB altında bir görsel seçin.";
  }
  return `Yükleme başarısız: ${message}`;
}

async function uploadToBlob(
  pathname: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const token = resolveBlobToken();
  const putOptions = {
    contentType,
    addRandomSuffix: false,
    ...(token ? { token } : {}),
  };

  try {
    const blob = await put(pathname, buffer, { ...putOptions, access: "public" });
    return blob.url;
  } catch (publicErr) {
    console.warn("Public blob upload failed, trying private:", publicErr);
    await put(pathname, buffer, { ...putOptions, access: "private" });
    return `/api/media?pathname=${encodeURIComponent(pathname)}`;
  }
}

export async function saveUploadedImage(
  buffer: Buffer,
  ext: string,
  contentType: string
): Promise<string> {
  const filename = `${randomUUID()}.${ext}`;
  const pathname = `products/${filename}`;

  if (shouldUseBlobStorage()) {
    return uploadToBlob(pathname, buffer, contentType);
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return `/api/uploads/products/${filename}`;
}

export function localUploadContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "heic":
    case "heif":
      return "image/heic";
    default:
      return "image/jpeg";
  }
}