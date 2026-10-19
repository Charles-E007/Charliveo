import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  interactive = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-[#E5E5E5] rounded-xl p-5 text-[#0F0F0F] transition-all ${
        interactive ? 'hover:shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:border-[#D4D4D4]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
