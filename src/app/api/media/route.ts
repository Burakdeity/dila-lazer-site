import { get } from "@vercel/blob";
import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { localUploadContentType, resolveBlobToken } from "@/lib/upload-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get("pathname");

  if (!pathname || pathname.includes("..")) {
    return NextResponse.json({ error: "Geçersiz dosya yolu" }, { status: 400 });
  }

  const token = resolveBlobToken();
  const getOptions = token ? { token } : {};

  for (const access of ["private", "public"] as const) {
    try {
      const result = await get(pathname, { access, ...getOptions });
      if (result?.statusCode === 200 && result.stream) {
        return new NextResponse(result.stream, {
          headers: {
            "Content-Type": result.blob.contentType ?? "application/octet-stream",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch {
      // try next access mode
    }
  }

  const localPath = path.join(UPLOAD_ROOT, ...pathname.split("/"));
  const resolvedRoot = path.resolve(UPLOAD_ROOT);
  if (path.resolve(localPath).startsWith(resolvedRoot)) {
    try {
      const buffer = await readFile(localPath);
      const filename = pathname.split("/").pop() ?? "file";
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": localUploadContentType(filename),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // fall through
    }
  }

  return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 404 });
}
