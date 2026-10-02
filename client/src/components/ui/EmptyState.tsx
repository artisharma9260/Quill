import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {icon && (
        <div className="mb-5 text-[#D6D3D1]">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold font-serif text-[#1C1917] mb-2">{title}</h3>
      <p className="text-sm text-[#78716C] font-sans max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
