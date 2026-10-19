import React from 'react';

export interface BadgeStatusProps {
  status: 'UP' | 'DOWN' | 'PENDING' | 'PAUSED' | string;
  showIcon?: boolean;
}

export const BadgeStatus: React.FC<BadgeStatusProps> = ({
  status = 'PENDING',
  showIcon = true,
}) => {
  // Badges de statut conformes à design.md :
  // UP : Fond #2BA640 (Vert), texte blanc, border-radius: 9999px
  // DOWN : Fond #FF0000 (Rouge), texte blanc, border-radius: 9999px
  // PAUSED : Fond #606060, texte blanc, border-radius: 9999px
  // PENDING : Fond #FB8C00, texte blanc, border-radius: 9999px
  const normalized = status ? status.toUpperCase() : 'PENDING';

  const configs: Record<string, { bg: string; text: string; icon: string; label: string }> = {
    UP: {
      bg: 'bg-[#2BA640]',
      text: 'text-white',
      icon: 'check_circle',
      label: 'UP',
    },
    DOWN: {
      bg: 'bg-[#FF0000]',
      text: 'text-white',
      icon: 'error',
      label: 'DOWN',
    },
    PAUSED: {
      bg: 'bg-[#606060]',
      text: 'text-white',
      icon: 'pause_circle',
      label: 'PAUSED',
    },
    PENDING: {
      bg: 'bg-[#FB8C00]',
      text: 'text-white',
      icon: 'schedule',
      label: 'PENDING',
    },
  };

  const config = configs[normalized] || configs.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase select-none ${config.bg} ${config.text}`}
    >
      {showIcon && (
        <span className="material-symbols-outlined text-[13px] leading-none">
          {config.icon}
        </span>
      )}
      <span>{config.label}</span>
    </span>
  );
};
