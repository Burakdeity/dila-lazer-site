import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/pjpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "gif"];

function resolveBlobToken(): string | undefined {
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

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const typeOk = !file.type || ALLOWED_TYPES.includes(file.type);
    const extOk = ALLOWED_EXT.includes(ext);

    if (!typeOk && !extOk) {
      return NextResponse.json({ error: "Sadece JPG, PNG, WEBP veya GIF yüklenebilir" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Dosya boyutu 5 MB'dan küçük olmalı" }, { status: 400 });
    }

    const safeExt = extOk ? ext : "jpg";
    const filename = `${randomUUID()}.${safeExt}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || `image/${safeExt === "jpg" ? "jpeg" : safeExt}`;

    const blobToken = resolveBlobToken();
    const hasBlobStore = Boolean(process.env.BLOB_STORE_ID);
    const useBlob =
      blobToken || hasBlobStore || process.env.VERCEL === "1";

    if (useBlob) {
      const blob = await put(`products/${filename}`, buffer, {
        access: "public",
        contentType,
        ...(blobToken ? { token: blobToken } : {}),
      });
      return NextResponse.json({ url: blob.url });
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
    return NextResponse.json({ url: `/uploads/products/${filename}` });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Yükleme başarısız" }, { status: 500 });
  }
}
