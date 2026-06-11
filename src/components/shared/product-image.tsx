"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  fallbackClassName?: string;
};

function isRawImage(src: string) {
  return (
    src.startsWith("/uploads/") ||
    src.startsWith("/api/media") ||
    src.includes("blob.vercel-storage.com")
  );
}

export function ProductImage({
  src,
  alt,
  className,
  fallbackClassName,
  fill,
  ...props
}: ProductImageProps) {
  const [error, setError] = useState(false);

  const fallback = (
    <div
      className={cn(
        "flex items-center justify-center bg-gray-100 text-gray-300",
        fill && "absolute inset-0",
        fallbackClassName,
        !fill && className
      )}
    >
      <ImageIcon className="h-8 w-8" />
    </div>
  );

  if (!src || error) return fallback;

  if (isRawImage(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setError(true)}
        className={cn(
          fill ? "absolute inset-0 h-full w-full" : "h-full w-full",
          className
        )}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
