import { NextResponse } from "next/server";
import { requireAdminSession, adminUnauthorized } from "@/lib/admin-auth";
import {
  getUploadAvailability,
  saveUploadedImage,
  uploadErrorMessage,
  validateUploadFile,
} from "@/lib/upload-storage";

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return adminUnauthorized();

  const availability = getUploadAvailability();
  if (!availability.ok) {
    return NextResponse.json({ error: availability.error }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
    }

    const validation = validateUploadFile(file);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveUploadedImage(buffer, validation.ext, validation.contentType);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: uploadErrorMessage(err) }, { status: 500 });
  }
}
