import { FileText } from "lucide-react";
import { getAllQuotes, getQuoteStats } from "@/lib/quote-store";
import { QUOTE_STATUS_LABELS } from "@/types/admin";
import { QuoteStatusSelect } from "@/components/admin/quote-status-select";
import {
  AdminPageHeader, AdminCard,
  AdminBadge, AdminEmpty, AdminStatCard,
} from "@/components/admin/admin-ui";

const statusVariant = {
  new: "info",
  reviewing: "warning",
  quoted: "default",
  accepted: "success",
  rejected: "danger",
} as const;

export default async function AdminQuotesPage() {
  const quotes = await getAllQuotes();
  const stats = await getQuoteStats();

  return (
    <div>
      <AdminPageHeader title="Teklifler" description={`${stats.total} teklif talebi`} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <AdminStatCard label="Toplam Teklif" value={stats.total} />
        <AdminStatCard label="Yeni Talepler" value={stats.new} accent="red" />
        <AdminStatCard label="Aktif" value={stats.active} accent="amber" />
      </div>

      {quotes.length === 0 ? (
        <AdminEmpty icon={FileText} title="Henüz teklif talebi yok" description="Teklif Al formundan gelen talepler burada görünür." />
      ) : (
        <div className="space-y-4">
          {quotes.map((q) => (
            <AdminCard key={q.id} className="p-5">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-semibold">{q.name}</h3>
                    <AdminBadge variant={statusVariant[q.status]}>{QUOTE_STATUS_LABELS[q.status]}</AdminBadge>
                  </div>
                  <p className="text-sm text-brand-red font-medium mb-1">{q.productType}</p>
                  <p className="text-sm text-gray-400 mb-3">{q.message}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>{q.email}</span>
                    <span>{q.phone}</span>
                    {q.company && <span>{q.company}</span>}
                    <span>{new Date(q.createdAt).toLocaleDateString("tr-TR")}</span>
                  </div>
                </div>
                <QuoteStatusSelect quoteId={q.id} current={q.status} />
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
