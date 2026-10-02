import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  wrapperClassName?: string;
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  wrapperClassName = '',
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[#1C1917] font-sans"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]">{leftIcon}</div>
        )}
        <input
          id={inputId}
          className={`
            w-full px-3 py-2.5 rounded-md border text-sm font-sans text-[#1C1917]
            bg-white placeholder:text-[#A8A29E]
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent
            ${error ? 'border-[#C41E3A]' : 'border-[#E7E5E4]'}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C]">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-[#C41E3A] font-sans">{error}</p>}
      {hint && !error && <p className="text-xs text-[#78716C] font-sans">{hint}</p>}
    </div>
  );
}
