import React from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  className = '',
  style,
  ...props
}) => {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{ fontSize: `${size}px`, width: `${size}px`, height: `${size}px`, ...style }}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
};
