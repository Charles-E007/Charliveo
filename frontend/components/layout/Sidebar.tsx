"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CharliveoLogo from '../ui/CharliveoLogo';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'grid_view' },
    { label: 'Moniteurs', href: '/monitors', icon: 'monitoring' },
    { label: 'Alertes', href: '/alerts', icon: 'notifications' },
    { label: 'Profil', href: '/profile', icon: 'person' },
    { label: 'Paramètres', href: '/settings', icon: 'settings' },
  ];

  return (
    <>
      {/* 1. Desktop Sidebar (visible on md:) */}
      <aside
        className={`bg-white border-r border-[#E5E5E5] min-h-[calc(100dvh-56px)] hidden md:flex flex-col justify-between transition-all duration-200 shrink-0 ${
          collapsed ? 'w-[72px] p-2' : 'w-[240px] p-4'
        }`}
      >
        {/* Top Nav Links */}
        <div className="flex flex-col gap-1.5">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#606060]">
            {!collapsed ? 'Menu Principal' : 'Menu'}
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-[#F2F2F2] text-[#0F0F0F] font-bold'
                      : 'text-[#606060] font-normal hover:bg-[#F2F2F2] hover:text-[#0F0F0F]'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-[#FF0000]' : 'text-[#606060]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom section : Collapse toggle & quick status */}
        <div className="flex flex-col gap-2 pt-4 border-t border-[#E5E5E5]">
          {!collapsed && (
            <div className="p-3 bg-[#F2F2F2] rounded-xl flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0F0F0F]">Moteur de Ping</span>
                <span className="w-2 h-2 rounded-full bg-[#2BA640] animate-ping" />
              </div>
              <p className="text-[11px] text-[#606060]">
                Surveillance active 24/7
              </p>
            </div>
          )}

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              type="button"
              className="flex items-center justify-center gap-2 p-2 rounded-xl text-xs text-[#606060] hover:bg-[#F2F2F2] hover:text-[#0F0F0F] transition-colors"
              title={collapsed ? 'Développer la barre latérale' : 'Réduire la barre latérale'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {collapsed ? 'chevron_right' : 'chevron_left'}
              </span>
              {!collapsed && <span>Réduire la barre</span>}
            </button>
          )}
        </div>
      </aside>

      {/* 2. Mobile Drawer & Backdrop (mobile/tablet < md:) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white flex flex-col justify-between p-4 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-4">
          {/* Header Drawer */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
            <CharliveoLogo variant="horizontal" color="#0F0F0F" width={135} height={30} />
            <button
              type="button"
              onClick={onCloseMobile}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#606060] hover:bg-[#F2F2F2] hover:text-[#0F0F0F] transition-colors"
              aria-label="Fermer le menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-[#606060]">
            Navigation
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-[#F2F2F2] text-[#0F0F0F] font-bold'
                      : 'text-[#606060] font-normal hover:bg-[#F2F2F2] hover:text-[#0F0F0F]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${
                      isActive ? 'text-[#FF0000]' : 'text-[#606060]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-3 border-t border-[#E5E5E5] flex flex-col gap-2">
          <div className="p-3 bg-[#F2F2F2] rounded-xl flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#0F0F0F]">Surveillance Active</span>
              <span className="w-2 h-2 rounded-full bg-[#2BA640] animate-ping" />
            </div>
            <p className="text-[11px] text-[#606060]">
              Réveil automatique et alertes en direct
            </p>
          </div>
        </div>
      </div>

      {/* 3. Mobile Bottom Navigation Bar (thumb navigation on < md:) */}
      <nav
        aria-label="Navigation mobile"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E5E5] h-16 flex items-center justify-around px-1 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] md:hidden"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-colors relative ${
                isActive ? 'text-[#FF0000] font-semibold' : 'text-[#606060] hover:text-[#0F0F0F]'
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] leading-none ${isActive ? 'text-[#FF0000]' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[58px]">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#FF0000] absolute bottom-1" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
};
