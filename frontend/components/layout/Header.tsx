"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import CharliveoLogo from '../ui/CharliveoLogo';

interface HeaderProps {
  user?: { fullName: string; email: string };
  onLogout?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onToggleSidebar }) => {
  return (
    <header className="w-full h-14 bg-white border-b border-[#E5E5E5] px-3.5 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-shadow">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            type="button"
            className="md:hidden p-1.5 -ml-1 rounded-lg text-[#0F0F0F] hover:bg-[#F2F2F2] transition-colors flex items-center justify-center"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        )}
        <Link href="/dashboard" className="flex items-center gap-2 group shrink-0">
          <CharliveoLogo variant="horizontal" color="#0F0F0F" width={135} height={30} className="sm:hidden" />
          <CharliveoLogo variant="horizontal" color="#0F0F0F" width={160} height={36} className="hidden sm:block" />
        </Link>
      </div>

      {/* Center Status Pill */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#F2F2F2] rounded-full text-xs text-[#606060]">
        <span className="w-2 h-2 rounded-full bg-[#2BA640] animate-ping" />
        <span>Réseau de surveillance actif</span>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop user pill */}
            <div className="hidden sm:flex items-center gap-2.5 pl-2 pr-3 py-1 bg-[#F2F2F2] rounded-full">
              <div className="w-6 h-6 rounded-full bg-[#0F0F0F] text-white text-xs font-semibold flex items-center justify-center uppercase">
                {user.fullName ? user.fullName.charAt(0) : 'U'}
              </div>
              <span className="text-xs font-medium text-[#0F0F0F] max-w-[120px] truncate">
                {user.fullName}
              </span>
            </div>

            {/* Mobile user avatar */}
            <div className="sm:hidden w-7 h-7 rounded-full bg-[#0F0F0F] text-white text-xs font-bold flex items-center justify-center uppercase shadow-xs">
              {user.fullName ? user.fullName.charAt(0) : 'U'}
            </div>

            {/* Logout button (icon only on mobile, text on desktop) */}
            <Button
              variant="secondary"
              size="sm"
              onClick={onLogout}
              iconLeft="logout"
              title="Déconnexion"
              className="h-8 px-2 sm:px-3 text-xs"
            >
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="px-2.5 sm:px-3 text-xs">
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm" className="px-3 sm:px-3.5 text-xs">
                Démarrer
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
