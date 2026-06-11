"use client";

import { useCallback, useState } from "react";
import { ProductImage } from "@/components/shared/product-image";
import { Upload, X, GripVertical, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setError("");
      const list = Array.from(files);
      if (!list.length) return;

      setUploading(true);
      const newUrls: string[] = [];

      for (const file of list) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Yükleme hatası");
          continue;
        }
        newUrls.push(data.url);
      }

      if (newUrls.length) onChange([...images, ...newUrls]);
      setUploading(false);
    },
    [images, onChange]
  );

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const setCover = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          dragOver ? "border-brand-red bg-brand-red/5" : "border-white/15 bg-white/[0.02]",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="absolute inset-0 cursor-pointer opacity-0"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          disabled={uploading}
        />
        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <Loader2 className="h-10 w-10 text-brand-red animate-spin" />
          ) : (
            <Upload className="h-10 w-10 text-gray-500" />
          )}
          <div>
            <p className="text-sm font-medium text-white">Görselleri sürükleyin veya tıklayın</p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP — maks. 5 MB</p>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40"
            >
              <ProductImage src={url} alt="" fill className="object-cover" sizes="160px" />
              {index === 0 && (
                <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-red text-[10px] font-semibold text-white">
                  <Star className="h-3 w-3" /> Kapak
                </span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => setCover(index)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-brand-red text-white"
                    title="Kapak yap"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-red-600 text-white"
                  title="Sil"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <GripVertical className="absolute bottom-2 right-2 h-4 w-4 text-white/40" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
