import Link from "next/link";
import { Palette, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DesignsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-brand-black">Tasarımlarım</h1>
        <Link href="/ozel-tasarim-merkezi">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Yeni Tasarım
          </Button>
        </Link>
      </div>
      <div className="glass-card p-12 text-center">
        <Palette className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-6">Henüz kayıtlı tasarımınız yok.</p>
        <Link href="/ozel-tasarim-merkezi">
          <Button>Kendin Tasarla&apos;ya Git</Button>
        </Link>
      </div>
    </div>
  );
}
