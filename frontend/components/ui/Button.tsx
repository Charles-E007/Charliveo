import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'broadcast' | 'secondary' | 'danger' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: string;
  iconRight?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  className = '',
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    // Primary CTA ("Nouveau Moniteur") : Fond sombre #0F0F0F, texte blanc #FFFFFF, hauteur 36px, border-radius: 9999px (forme pilule), Roboto 14px weight 500
    primary: 'bg-[#0F0F0F] text-white hover:bg-[#262626] active:bg-[#000000] rounded-full',
    // Broadcast Action ("Ping Instantané") : Fond #FF0000, texte blanc, border-radius: 9999px
    broadcast: 'bg-[#FF0000] text-white hover:bg-[#CC0000] active:bg-[#B30000] rounded-full shadow-sm',
    // Outlined / Secondary : Contour 1px #E5E5E5, fond blanc #FFFFFF, survol #F2F2F2, border-radius: 9999px
    secondary: 'bg-white text-[#0F0F0F] border border-[#E5E5E5] hover:bg-[#F2F2F2] active:bg-[#EAEAEA] rounded-full',
    // Danger : contour/fond doux avec texte #FF0000
    danger: 'bg-red-50 text-[#FF0000] border border-red-200 hover:bg-[#FF0000] hover:text-white rounded-full',
    // Ghost : transparent, survol #F2F2F2
    ghost: 'bg-transparent text-[#606060] hover:bg-[#F2F2F2] hover:text-[#0F0F0F] rounded-full',
    // Icon Buttons : Boutons circulaires de 36px/40px, fond transparent, icône #606060, survol #F2F2F2
    icon: 'bg-transparent text-[#606060] hover:bg-[#F2F2F2] hover:text-[#0F0F0F] rounded-full p-0',
  };

  const sizes = {
    sm: variant === 'icon' ? 'w-8 h-8' : 'h-8 px-3 text-xs gap-1.5',
    md: variant === 'icon' ? 'w-9 h-9' : 'h-9 px-4 text-sm gap-2',
    lg: variant === 'icon' ? 'w-10 h-10' : 'h-11 px-5 text-sm gap-2.5',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {iconLeft && (
        <span className="material-symbols-outlined text-[18px] leading-none">
          {iconLeft}
        </span>
      )}
      {children}
      {iconRight && (
        <span className="material-symbols-outlined text-[18px] leading-none">
          {iconRight}
        </span>
      )}
    </button>
  );
};
