import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { localUploadContentType } from "@/lib/upload-storage";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const segments = (await params).path;
  if (!segments.length || segments.some((s) => s.includes(".."))) {
    return NextResponse.json({ error: "Geçersiz dosya yolu" }, { status: 400 });
  }

  const filePath = path.join(UPLOAD_ROOT, ...segments);
  const resolvedRoot = path.resolve(UPLOAD_ROOT);
  if (!path.resolve(filePath).startsWith(resolvedRoot)) {
    return NextResponse.json({ error: "Geçersiz dosya yolu" }, { status: 400 });
  }

  try {
    const buffer = await readFile(filePath);
    const filename = segments[segments.length - 1] ?? "file";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": localUploadContentType(filename),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 404 });
  }
}
