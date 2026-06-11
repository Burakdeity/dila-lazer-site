import { Container } from "@/components/ui/container";

interface InfoPageProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function InfoPage({ title, subtitle, children }: InfoPageProps) {
  return (
    <div className="pt-8 pb-16 bg-gray-50 min-h-screen">
      <Container size="narrow">
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-black">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
        </header>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm prose prose-sm sm:prose-base max-w-none text-gray-600">
          {children}
        </div>
      </Container>
    </div>
  );
}
