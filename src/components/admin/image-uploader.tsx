"use client";

import { useCallback, useRef, useState } from "react";
import { ProductImage } from "@/components/shared/product-image";
import { Upload, X, GripVertical, Loader2, Star, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { isAllowedImageUrl } from "@/lib/image-url";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  /** Tek görsel modunda yeni yükleme mevcut görselin yerine geçer */
  mode?: "single" | "multiple";
}

export function ImageUploader({ images, onChange, mode = "multiple" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setError("");
      setSuccess("");
      const list = Array.from(files);
      if (!list.length) return;

      setUploading(true);
      const newUrls: string[] = [];
      let lastError = "";

      for (const file of list) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
            credentials: "include",
          });

          let data: { url?: string; error?: string } = {};
          const raw = await res.text();
          try {
            data = raw ? JSON.parse(raw) : {};
          } catch {
            lastError =
              res.status === 401
                ? "Oturum süresi doldu. Admin paneline tekrar giriş yapın."
                : res.status === 413
                  ? "Dosya çok büyük (maks. 10 MB)."
                  : `Sunucu hatası (${res.status}). Sayfayı yenileyip tekrar deneyin.`;
            continue;
          }

          if (!res.ok) {
            lastError = data.error || `Yükleme hatası (${res.status})`;
            continue;
          }

          if (data.url) {
            newUrls.push(data.url);
          }
        } catch {
          lastError = "Bağlantı hatası. İnternet bağlantınızı kontrol edin.";
        }
      }

      if (newUrls.length) {
        if (mode === "single") {
          onChange([newUrls[newUrls.length - 1]]);
          setSuccess("Görsel yüklendi. Kaydetmeyi unutmayın.");
        } else {
          onChange([...images, ...newUrls]);
          setSuccess(`${newUrls.length} görsel yüklendi. Kaydetmeyi unutmayın.`);
        }
      } else if (lastError) {
        setError(lastError);
      }

      setUploading(false);
    },
    [images, mode, onChange]
  );

  const applyUrl = () => {
    setError("");
    setSuccess("");
    const url = urlInput.trim();
    if (!isAllowedImageUrl(url)) {
      setError("Geçerli bir görsel URL'si girin (https://...jpg/png/webp veya yüklenmiş dosya yolu).");
      return;
    }
    if (mode === "single") {
      onChange([url]);
    } else if (!images.includes(url)) {
      onChange([...images, url]);
    }
    setUrlInput("");
    setShowUrlInput(false);
    setSuccess("Görsel eklendi. Kaydetmeyi unutmayın.");
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
    setSuccess("");
  };

  const setCover = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  };

  const openFilePicker = () => {
    if (!uploading) inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        }}
        onClick={openFilePicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFilePicker();
          }
        }}
        role="button"
        tabIndex={0}
        className={cn(
          "relative rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
          dragOver ? "border-brand-red bg-brand-red/5" : "border-white/15 bg-white/[0.02]",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
          multiple={mode === "multiple"}
          className="sr-only"
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
            e.target.value = "";
          }}
          disabled={uploading}
        />
        <div className="pointer-events-none flex flex-col items-center gap-3">
          {uploading ? (
            <Loader2 className="h-10 w-10 text-brand-red animate-spin" />
          ) : (
            <Upload className="h-10 w-10 text-gray-500" />
          )}
          <div>
            <p className="text-sm font-medium text-white">
              {mode === "single" && images.length
                ? "Yeni görsel yüklemek için tıklayın veya sürükleyin"
                : "Görselleri sürükleyin veya tıklayın"}
            </p>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP, GIF — maks. 10 MB</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowUrlInput((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <Link2 className="h-3.5 w-3.5" />
          URL ile ekle
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://... veya /api/uploads/..."
            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-red/50"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="px-4 py-2 rounded-lg bg-brand-red text-white text-sm font-medium hover:bg-brand-red/90"
          >
            Ekle
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm text-green-400">
          {success}
        </div>
      )}

      {images.length > 0 && (
        <div
          className={cn(
            "grid gap-3",
            mode === "single" ? "grid-cols-1 max-w-[200px]" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
          )}
        >
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40"
            >
              <ProductImage src={url} alt="" fill className="object-cover" sizes="160px" />
              {(index === 0 || mode === "single") && (
                <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-red text-[10px] font-semibold text-white z-10">
                  <Star className="h-3 w-3" /> Kapak
                </span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                {mode === "multiple" && index !== 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCover(index);
                    }}
                    className="p-2 rounded-lg bg-white/10 hover:bg-brand-red text-white"
                    title="Kapak yap"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="p-2 rounded-lg bg-white/10 hover:bg-red-600 text-white"
                  title="Sil"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {mode === "multiple" && (
                <GripVertical className="absolute bottom-2 right-2 h-4 w-4 text-white/40 z-10" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
