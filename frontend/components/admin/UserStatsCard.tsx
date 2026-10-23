'use client';

import React from 'react';

export interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string | null;
  monitorsCount: number;
  upCount: number;
  downCount: number;
  pausedCount: number;
  pendingCount: number;
  avgLatencyMs: number;
}

export const formatMemberSince = (createdAt: string | null): string => {
  if (!createdAt) return 'Date inconnue';
  return new Date(createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const isAdmin = role === 'ADMIN';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase select-none ${
        isAdmin ? 'bg-[#0F0F0F] text-white' : 'bg-[#F2F2F2] text-[#606060]'
      }`}
    >
      <span className="material-symbols-outlined text-[13px] leading-none">
        {isAdmin ? 'shield_person' : 'person'}
      </span>
      <span>{isAdmin ? 'Admin' : 'User'}</span>
    </span>
  );
};

interface UserStatsCardProps {
  user: AdminUser;
}

/**
 * Carte utilisateur (vue mobile) : identité, rôle, date d'inscription
 * et bloc de métriques de monitoring sur fond gris surface.
 */
export const UserStatsCard: React.FC<UserStatsCardProps> = ({ user }) => {
  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#0F0F0F] text-white text-sm font-semibold flex items-center justify-center uppercase shrink-0">
            {user.fullName ? user.fullName.charAt(0) : 'U'}
          </div>
          <div className="flex flex-col min-w-0">
            <span
              className="text-[15px] font-medium text-[#0F0F0F] truncate tracking-tight"
              title={user.fullName}
            >
              {user.fullName}
            </span>
            <span className="text-xs text-[#606060] truncate" title={user.email}>
              {user.email}
            </span>
          </div>
        </div>
        <RoleBadge role={user.role} />
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-[#606060]">
        <span className="material-symbols-outlined text-[14px]">event</span>
        <span>Inscrit le {formatMemberSince(user.createdAt)}</span>
      </div>

      {/* Bloc de métriques : grille de 4 colonnes sur fond gris surface #F2F2F2 */}
      <div className="grid grid-cols-4 gap-1 py-2 px-2 bg-[#F2F2F2] rounded-lg text-center">
        <div className="flex flex-col items-center">
          <span className="text-[11px] text-[#606060]">Moniteurs</span>
          <span className="text-sm font-bold text-[#0F0F0F] mt-0.5">{user.monitorsCount}</span>
        </div>
        <div className="flex flex-col items-center border-l border-[#E5E5E5]">
          <span className="text-[11px] text-[#606060]">En ligne</span>
          <span className="text-sm font-bold text-[#2BA640] mt-0.5">{user.upCount}</span>
        </div>
        <div className="flex flex-col items-center border-l border-[#E5E5E5]">
          <span className="text-[11px] text-[#606060]">En panne</span>
          <span
            className={`text-sm font-bold mt-0.5 ${
              user.downCount > 0 ? 'text-[#FF0000]' : 'text-[#0F0F0F]'
            }`}
          >
            {user.downCount}
          </span>
        </div>
        <div className="flex flex-col items-center border-l border-[#E5E5E5]">
          <span className="text-[11px] text-[#606060]">Latence</span>
          <span className="text-sm font-bold text-[#0F0F0F] mt-0.5">
            {user.avgLatencyMs ? `${user.avgLatencyMs}` : '—'}
            {user.avgLatencyMs ? <span className="text-[10px] font-normal text-[#606060]">ms</span> : null}
          </span>
        </div>
      </div>
    </div>
  );
};
