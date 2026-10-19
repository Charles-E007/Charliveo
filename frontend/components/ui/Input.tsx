import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  pill?: boolean;
  iconLeft?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  pill = false,
  iconLeft,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#0F0F0F]">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {iconLeft && (
          <span className="material-symbols-outlined text-[18px] text-[#606060] absolute left-3 pointer-events-none">
            {iconLeft}
          </span>
        )}
        <input
          id={inputId}
          className={`h-10 bg-[#F2F2F2] border border-transparent text-sm text-[#0F0F0F] placeholder-[#606060] transition-colors focus:outline-none focus:border-[#0F0F0F] focus:bg-white w-full ${
            pill ? 'rounded-full px-4' : 'rounded-lg px-3.5'
          } ${iconLeft ? 'pl-9' : ''} ${
            error ? 'border-[#FF0000] bg-red-50 focus:border-[#FF0000]' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs font-normal text-[#FF0000]">{error}</span>}
      {hint && !error && <span className="text-xs text-[#606060]">{hint}</span>}
    </div>
  );
};
