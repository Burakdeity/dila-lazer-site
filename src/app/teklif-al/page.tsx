"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function QuotePage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="pt-24 pb-20 bg-white min-h-screen">
        <Container size="narrow" className="text-center py-20">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-brand-black mb-4">Teklif Talebiniz Alındı</h1>
          <p className="text-gray-500">En kısa sürede size dönüş yapacağız.</p>
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-32 pb-20 bg-white min-h-screen">
      <Container size="narrow">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4">Ücretsiz Teklif Al</h1>
          <p className="text-gray-500">Projeniz için özel fiyat teklifi alın</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          className="glass-card p-8 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required placeholder="Ad Soyad *" className="form-input" />
            <input required type="email" placeholder="E-posta *" className="form-input" />
            <input required type="tel" placeholder="Telefon *" className="form-input" />
            <input placeholder="Firma Adı" className="form-input" />
          </div>
          <select required className="form-input w-full">
            <option value="">Tabela Türü Seçin *</option>
            <option>3D Neon Tabela</option>
            <option>LED Tabela</option>
            <option>Kutu Harf</option>
            <option>Pleksi Tabela</option>
            <option>Diğer</option>
          </select>
          <textarea
            required
            placeholder="Proje detaylarınızı yazın (ölçü, renk, malzeme vb.) *"
            rows={4}
            className="form-input w-full resize-none"
          />
          <label className="flex flex-col items-center p-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-brand-red/30 transition-colors">
            <span className="text-sm text-gray-500">Logo veya referans görsel yükleyin (opsiyonel)</span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
          <Button type="submit" size="lg" className="w-full">
            <Send className="h-4 w-4" />
            Teklif Talebi Gönder
          </Button>
        </form>
      </Container>
    </div>
  );
}
