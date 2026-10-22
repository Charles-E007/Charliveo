"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { clearSession } from '@/lib/session';

export interface AlertItem {
  id: string;
  monitorName: string;
  status: 'UP' | 'DOWN';
  code: number;
  message: string;
  url: string;
  time: string;
}

export default function AlertsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'DOWN' | 'UP'>('ALL');
  
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/monitors/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error('Erreur lors du chargement des alertes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Récupérer le profil utilisateur
    api
      .get('/api/v1/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {});

    // 2. Récupérer les vraies alertes du compte
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'ALL') return true;
    return a.status === filter;
  });

  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return '---';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));

    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col selection:bg-red-50 selection:text-[#FF0000]">
      <Header
        user={user}
        onLogout={() => {
          clearSession();
          router.push('/login');
        }}
        onToggleSidebar={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="flex flex-1 min-w-0">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 max-w-5xl pb-24 md:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F0F0F]">
                Historique des Alertes & Incidents
              </h1>
              <p className="text-xs text-[#606060] mt-0.5">
                Journal en temps réel des pings et rétablissements de vos services
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  filter === 'ALL'
                    ? 'bg-[#0F0F0F] text-white'
                    : 'bg-[#F2F2F2] text-[#606060] hover:text-[#0F0F0F]'
                }`}
              >
                Toutes ({alerts.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('DOWN')}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  filter === 'DOWN'
                    ? 'bg-[#FF0000] text-white'
                    : 'bg-red-50 text-[#FF0000] hover:bg-[#FF0000] hover:text-white'
                }`}
              >
                Pannes Critiques
              </button>
              <button
                type="button"
                onClick={() => setFilter('UP')}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  filter === 'UP'
                    ? 'bg-[#2BA640] text-white'
                    : 'bg-green-50 text-[#2BA640] hover:bg-[#2BA640] hover:text-white'
                }`}
              >
                Rétablissements
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#606060]">
              <span className="material-symbols-outlined text-3xl animate-spin mb-2">refresh</span>
              <p className="text-xs">Chargement de votre historique d'alertes...</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-8 text-center flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-4xl text-[#606060]">notifications_off</span>
              <h3 className="text-sm font-bold text-[#0F0F0F]">Aucun incident enregistré</h3>
              <p className="text-xs text-[#606060] max-w-sm">
                Aucun log d'alerte ne correspond à ce filtre pour votre compte actuellement.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredAlerts.map((alert) => {
                const isDown = alert.status === 'DOWN';

                return (
                  <div
                    key={alert.id}
                    className={`bg-white border rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 transition-all ${
                      isDown ? 'border-red-200 hover:border-[#FF0000]' : 'border-[#E5E5E5] hover:border-[#2BA640]'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0 w-full sm:w-auto">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isDown ? 'bg-red-50 text-[#FF0000]' : 'bg-green-50 text-[#2BA640]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {isDown ? 'warning' : 'check_circle'}
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-[#0F0F0F] truncate">
                            {alert.monitorName}
                          </span>
                          <span
                            className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              isDown ? 'bg-[#FF0000] text-white' : 'bg-[#2BA640] text-white'
                            }`}
                          >
                            {alert.status} &bull; HTTP {alert.code}
                          </span>
                        </div>
                        <p className="text-xs text-[#606060] leading-relaxed">
                          {alert.message}
                        </p>
                        <span className="text-[11px] font-mono text-[#065FD4] truncate">
                          {alert.url}
                        </span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E5E5] gap-1 text-[11px] text-[#606060] shrink-0">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">schedule</span>
                        <span>{formatRelativeTime(alert.time)}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}