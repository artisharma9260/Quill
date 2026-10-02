import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
  charCount?: number;
  maxChars?: number;
}

export function Textarea({
  label,
  error,
  hint,
  wrapperClassName = '',
  className = '',
  id,
  charCount,
  maxChars,
  ...props
}: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {(label || maxChars !== undefined) && (
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={inputId} className="text-sm font-medium text-[#1C1917] font-sans">
              {label}
            </label>
          )}
          {maxChars !== undefined && (
            <span
              className={`text-xs font-mono ${
                (charCount ?? 0) > maxChars ? 'text-[#C41E3A]' : 'text-[#78716C]'
              }`}
            >
              {charCount ?? 0}/{maxChars}
            </span>
          )}
        </div>
      )}
      <textarea
        id={inputId}
        className={`
          w-full px-3 py-2.5 rounded-md border text-sm font-sans text-[#1C1917]
          bg-white placeholder:text-[#A8A29E] resize-none
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent
          ${error ? 'border-[#C41E3A]' : 'border-[#E7E5E4]'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-[#C41E3A] font-sans">{error}</p>}
      {hint && !error && <p className="text-xs text-[#78716C] font-sans">{hint}</p>}
    </div>
  );
}
