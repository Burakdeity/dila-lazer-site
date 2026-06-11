"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import type { BlogPost } from "@/data/catalog/blog";
import { SingleImageUpload } from "@/components/admin/single-image-upload";
import { adminInputClass, adminLabelClass } from "@/components/admin/admin-ui";
import { slugify } from "@/lib/utils";

interface BlogFormProps {
  post?: BlogPost;
}

export function BlogForm({ post }: BlogFormProps) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [cover, setCover] = useState(post?.cover ?? "");
  const [category, setCategory] = useState(post?.category ?? "Rehber");
  const [date, setDate] = useState(post?.date ?? new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }));
  const [author, setAuthor] = useState(post?.author ?? "Editör");
  const [content, setContent] = useState(post?.content.join("\n\n") ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      slug: slug || slugify(title),
      excerpt,
      cover,
      category,
      date,
      author,
      content: content.split("\n\n").map((p) => p.trim()).filter(Boolean),
    };

    const url = isEdit ? `/api/admin/blog/${post.slug}` : "/api/admin/blog";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      router.push("/admin/blog");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Kayıt başarısız");
    }
  };

  const handleDelete = async () => {
    if (!post || !confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/api/admin/blog/${post.slug}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/blog");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Bloga dön
      </Link>

      {error && (
        <div className="p-3 rounded-xl text-sm bg-red-500/10 text-red-400 border border-red-500/30">{error}</div>
      )}

      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={adminLabelClass}>Başlık *</label>
            <input className={adminInputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className={adminLabelClass}>Slug (URL)</label>
            <input className={adminInputClass} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="otomatik oluşur" />
          </div>
        </div>
        <div>
          <label className={adminLabelClass}>Özet</label>
          <textarea className={`${adminInputClass} resize-y`} rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={adminLabelClass}>Kategori</label>
            <input className={adminInputClass} value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div>
            <label className={adminLabelClass}>Tarih</label>
            <input className={adminInputClass} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label className={adminLabelClass}>Yazar</label>
            <input className={adminInputClass} value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
        </div>
        <SingleImageUpload value={cover} onChange={setCover} label="Kapak Görseli *" />
        <div>
          <label className={adminLabelClass}>İçerik (paragraflar arası boş satır)</label>
          <textarea className={`${adminInputClass} resize-y`} rows={10} value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-red text-white rounded-xl font-medium hover:bg-brand-red/90 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isEdit ? "Güncelle" : "Kaydet"}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} className="inline-flex items-center gap-2 px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl">
            <Trash2 className="h-4 w-4" /> Sil
          </button>
        )}
      </div>
    </form>
  );
}
