"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";

interface ProductActionsProps {
  id: string;
  slug: string;
}

export function ProductActions({ id, slug }: ProductActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

    setDeleting(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleting(false);

    if (res.ok) {
      router.refresh();
    } else {
      alert("Silme işlemi başarısız");
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/urun/${slug}`}
        target="_blank"
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
        title="Mağazada gör"
      >
        <ExternalLink className="h-4 w-4" />
      </Link>
      <Link
        href={`/admin/urunler/${id}`}
        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
        title="Düzenle"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50"
        title="Sil"
      >
        {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
