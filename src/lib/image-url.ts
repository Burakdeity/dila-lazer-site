export function isAllowedImageUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (
    trimmed.startsWith("/uploads/") ||
    trimmed.startsWith("/api/uploads/") ||
    trimmed.startsWith("/api/media")
  ) {
    return true;
  }
  if (trimmed.startsWith("https://") && trimmed.includes("blob.vercel-storage.com")) {
    return true;
  }
  if (trimmed.startsWith("https://images.unsplash.com/")) {
    return true;
  }
  return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(trimmed);
}
