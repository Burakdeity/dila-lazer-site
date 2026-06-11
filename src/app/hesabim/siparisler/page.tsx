import { Package } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm text-center">
      <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h1 className="text-xl font-bold text-brand-black mb-2">Siparişlerim</h1>
      <p className="text-gray-500">Henüz siparişiniz bulunmuyor.</p>
    </div>
  );
}
