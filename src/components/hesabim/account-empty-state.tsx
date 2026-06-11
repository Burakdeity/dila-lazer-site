import type { LucideIcon } from "lucide-react";

interface AccountEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function AccountEmptyState({ icon: Icon, title, description, action }: AccountEmptyStateProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black mb-6">{title}</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
        <Icon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-6">{description}</p>
        {action}
      </div>
    </div>
  );
}
