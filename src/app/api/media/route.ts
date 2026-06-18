import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { resolveBlobToken } from "@/lib/upload-storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get("pathname");

  if (!pathname || pathname.includes("..")) {
    return NextResponse.json({ error: "Geçersiz dosya yolu" }, { status: 400 });
  }

  const token = resolveBlobToken();
  const getOptions = token ? { token } : {};

  try {
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

    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 404 });
  } catch (err) {
    console.error("Media proxy error:", err);
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 404 });
  }
}
