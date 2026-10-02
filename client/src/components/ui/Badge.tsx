import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'ghost';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-[#F5F5F4] text-[#44403C]',
    accent: 'bg-[#C41E3A] text-white',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    ghost: 'bg-transparent border border-[#E7E5E4] text-[#78716C]',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium font-sans tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
