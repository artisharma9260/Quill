import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
}

export function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  wrapperClassName = '',
  className = '',
  id,
  ...props
}: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#1C1917] font-sans">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          className={`
            w-full px-3 py-2.5 rounded-md border text-sm font-sans text-[#1C1917]
            bg-white appearance-none cursor-pointer pr-10
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent
            ${error ? 'border-[#C41E3A]' : 'border-[#E7E5E4]'}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C]">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-[#C41E3A] font-sans">{error}</p>}
      {hint && !error && <p className="text-xs text-[#78716C] font-sans">{hint}</p>}
    </div>
  );
}
