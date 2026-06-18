"use client";

import { ImageUploader } from "@/components/admin/image-uploader";

interface SingleImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function SingleImageUpload({ value, onChange, label = "Görsel" }: SingleImageUploadProps) {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-2">{label}</p>
      <ImageUploader
        mode="single"
        images={value ? [value] : []}
        onChange={(images) => onChange(images[0] ?? "")}
      />
    </div>
  );
}
