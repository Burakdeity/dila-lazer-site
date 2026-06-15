"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, X, GripVertical } from "lucide-react";
import type { PaymentMethodConfig, PaymentProvider } from "@/types/admin";
import { PAYMENT_PROVIDER_LABELS } from "@/types/admin";
import { adminInputClass, adminLabelClass } from "@/components/admin/admin-ui";

const PROVIDERS: PaymentProvider[] = ["paytr", "iyzico", "stripe", "havale", "kapida"];

interface PaymentMethodsFormProps {
  methods: PaymentMethodConfig[];
}

export function PaymentMethodsForm({ methods }: PaymentMethodsFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(() =>
    [...methods].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const update = (index: number, field: keyof PaymentMethodConfig, value: string | boolean | number) => {
    const next = [...form];
    next[index] = { ...next[index], [field]: value };
    setForm(next);
  };

  const addMethod = () => {
    const nextOrder = form.length ? Math.max(...form.map((m) => m.sortOrder)) + 1 : 1;
    setForm([
      ...form,
      {
        id: crypto.randomUUID(),
        provider: "paytr",
        name: "Yeni Ödeme",
        description: "",
        isActive: true,
        sortOrder: nextOrder,
      },
    ]);
  };

  const remove = (index: number) => {
    if (form.length <= 1) return;
    setForm(form.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentMethods: form }),
    });

    setSaving(false);
    if (res.ok) {
      setMessage("Ödeme yöntemleri kaydedildi");
      router.refresh();
    } else {
      setMessage("Kayıt başarısız");
    }
  };

  const needsBank = (provider: PaymentProvider) =>
    provider === "havale" || provider === "kapida";

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {message && (
        <div
          className={`p-3 rounded-xl text-sm ${
            message.includes("başarısız") ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
          }`}
        >
          {message}
        </div>
      )}

      <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-200">
        <p className="font-medium text-blue-100 mb-1">API anahtarları (PayTR, İyzico, Stripe)</p>
        <p className="text-blue-200/80">
          PayTR ve İyzico gibi sağlayıcıların merchant anahtarları Vercel ortam değişkenlerinden okunur
          (PAYTR_MERCHANT_ID, IYZICO_API_KEY vb.). Buradan yalnızca hangi yöntemlerin görüneceğini ve
          havale bilgilerini yönetirsiniz.
        </p>
        <p className="text-blue-200/80 text-xs mt-2">
          <span className="text-blue-100 font-medium">PayTR Bildirim URL:</span>{" "}
          <code className="text-blue-100">https://dilalazer.com/api/payments/paytr/callback</code>
          {" "}(PayTR panel → Ayarlar → Bildirim URL)
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Ödeme Yöntemleri ({form.length})</h2>
        <button
          type="button"
          onClick={addMethod}
          className="inline-flex items-center gap-1 text-sm text-brand-red hover:underline"
        >
          <Plus className="h-4 w-4" /> Yöntem Ekle
        </button>
      </div>

      {form.map((method, index) => (
        <div key={method.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-gray-500">
              <GripVertical className="h-4 w-4" />
              <span className="text-sm text-white font-medium">{method.name || "Yeni yöntem"}</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={method.isActive}
                  onChange={(e) => update(index, "isActive", e.target.checked)}
                />
                Aktif
              </label>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                aria-label="Kaldır"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={adminLabelClass}>Sağlayıcı</label>
              <select
                className={adminInputClass}
                value={method.provider}
                onChange={(e) => update(index, "provider", e.target.value)}
              >
                {PROVIDERS.map((p) => (
                  <option key={p} value={p}>
                    {PAYMENT_PROVIDER_LABELS[p]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={adminLabelClass}>Sıra</label>
              <input
                type="number"
                min={1}
                className={adminInputClass}
                value={method.sortOrder}
                onChange={(e) => update(index, "sortOrder", Number(e.target.value))}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Görünen ad</label>
              <input
                className={adminInputClass}
                value={method.name}
                onChange={(e) => update(index, "name", e.target.value)}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Açıklama</label>
              <input
                className={adminInputClass}
                value={method.description}
                onChange={(e) => update(index, "description", e.target.value)}
              />
            </div>
          </div>

          {needsBank(method.provider) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <label className={adminLabelClass}>Banka adı</label>
                <input
                  className={adminInputClass}
                  value={method.bankName ?? ""}
                  onChange={(e) => update(index, "bankName", e.target.value)}
                />
              </div>
              <div>
                <label className={adminLabelClass}>Hesap sahibi</label>
                <input
                  className={adminInputClass}
                  value={method.accountHolder ?? ""}
                  onChange={(e) => update(index, "accountHolder", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className={adminLabelClass}>IBAN</label>
                <input
                  className={adminInputClass}
                  value={method.iban ?? ""}
                  onChange={(e) => update(index, "iban", e.target.value)}
                  placeholder="TR00 0000 0000 0000 0000 0000 00"
                />
              </div>
              <div className="md:col-span-2">
                <label className={adminLabelClass}>Müşteriye not</label>
                <textarea
                  className={`${adminInputClass} resize-y min-h-[72px]`}
                  value={method.instructions ?? ""}
                  onChange={(e) => update(index, "instructions", e.target.value)}
                  placeholder="Dekont sonrası WhatsApp ile bilgi veriniz..."
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-red text-white rounded-xl font-medium hover:bg-brand-red/90 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Kaydet
      </button>
    </form>
  );
}
