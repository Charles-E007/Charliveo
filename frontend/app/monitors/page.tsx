"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { BadgeStatus } from '@/components/ui/BadgeStatus';
import { MonitorCard, MonitorItem } from '@/components/monitors/MonitorCard';
import { MonitorModal } from '@/components/monitors/MonitorModal';
import { api } from '@/lib/api';
import { clearSession } from '@/lib/session';

export default function MonitorsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [monitors, setMonitors] = useState<MonitorItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonitor, setSelectedMonitor] = useState<MonitorItem | null>(null);

  const fetchData = async () => {
    try {
      const [userRes, monitorsRes] = await Promise.all([
        api.get('/api/v1/auth/me'),
        api.get('/api/v1/monitors'),
      ]);
      setUser(userRes.data);
      setMonitors(monitorsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleManualPing = async (id: string) => {
    try {
      await api.post(`/api/v1/monitors/${id}/ping-now`);
      fetchData();
    } catch (err) {
      console.error('Erreur lors du ping manuel', err);
    }
  };

  const filteredMonitors = monitors.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.url.toLowerCase().includes(search.toLowerCase());

    const matchesMethod = methodFilter === 'ALL' || m.method === methodFilter;

    return matchesSearch && matchesMethod;
  });

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

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 max-w-7xl pb-24 md:pb-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F0F0F]">
                Moniteurs de Surveillance
              </h1>
              <p className="text-xs text-[#606060] mt-0.5">
                Gérez l'ensemble de vos sondes HTTP, fréquences de ping et codes attendus
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setSelectedMonitor(null);
                setIsModalOpen(true);
              }}
              iconLeft="add"
              className="w-full sm:w-auto"
            >
              <span>Nouveau Moniteur</span>
            </Button>
          </div>

          {/* Search, Filter & View Toggle Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2.5 sm:p-3 bg-[#F2F2F2] rounded-xl">
            <div className="relative flex-1 w-full sm:max-w-sm">
              <span className="material-symbols-outlined text-[18px] text-[#606060] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Rechercher par service ou URL..."
                className="h-9 w-full bg-white border border-transparent rounded-full pl-9 pr-4 text-xs text-[#0F0F0F] placeholder-[#606060] focus:outline-none focus:border-[#0F0F0F]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
              <select
                className="h-9 bg-white border border-[#E5E5E5] rounded-full px-3 text-xs text-[#0F0F0F] focus:outline-none focus:border-[#0F0F0F]"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <option value="ALL">Toutes méthodes</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="HEAD">HEAD</option>
                <option value="PUT">PUT</option>
              </select>

              <div className="flex items-center bg-white border border-[#E5E5E5] rounded-full p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-full flex items-center justify-center transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[#0F0F0F] text-white'
                      : 'text-[#606060] hover:text-[#0F0F0F]'
                  }`}
                  title="Vue Grille"
                >
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-full flex items-center justify-center transition-colors ${
                    viewMode === 'table'
                      ? 'bg-[#0F0F0F] text-white'
                      : 'text-[#606060] hover:text-[#0F0F0F]'
                  }`}
                  title="Vue Tableau"
                >
                  <span className="material-symbols-outlined text-[16px]">table_rows</span>
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[32px] text-[#606060] animate-spin">
                refresh
              </span>
              <span className="text-sm text-[#606060]">Chargement...</span>
            </div>
          ) : filteredMonitors.length === 0 ? (
            <div className="py-16 bg-white border border-[#E5E5E5] rounded-xl text-center flex flex-col items-center justify-center gap-2 p-6">
              <span className="material-symbols-outlined text-[32px] text-[#606060]">
                search_off
              </span>
              <h3 className="text-sm font-bold text-[#0F0F0F]">Aucun moniteur trouvé</h3>
              <p className="text-xs text-[#606060]">
                Modifiez vos termes de recherche ou créez un nouveau moniteur.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredMonitors.map((m) => (
                <MonitorCard
                  key={m._id}
                  monitor={m}
                  onRefresh={fetchData}
                  onEdit={(monitor) => {
                    setSelectedMonitor(monitor);
                    setIsModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-[#F2F2F2] border-b border-[#E5E5E5] text-[#606060] font-medium uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Service & Endpoint</th>
                      <th className="px-4 py-3">Méthode</th>
                      <th className="px-4 py-3">Intervalle</th>
                      <th className="px-4 py-3">Latence</th>
                      <th className="px-4 py-3">Disponibilité</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {filteredMonitors.map((m) => (
                      <tr key={m._id} className="hover:bg-[#F9F9F9] transition-colors">
                        <td className="px-4 py-3">
                          <BadgeStatus status={m.isActive ? m.lastStatus || 'PENDING' : 'PAUSED'} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-[#0F0F0F]">{m.name}</div>
                          <div className="font-mono text-[11px] text-[#065FD4] truncate max-w-xs">
                            {m.url}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono px-2 py-0.5 rounded bg-[#F2F2F2] text-[#065FD4]">
                            {m.method}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#606060]">{m.intervalMinutes} min</td>
                        <td className="px-4 py-3 font-medium text-[#0F0F0F]">
                          {m.lastResponseTimeMs || 0} ms
                        </td>
                        <td className="px-4 py-3 font-bold text-[#2BA640]">
                          {m.uptimePercentage ?? 100}%
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="broadcast"
                              size="sm"
                              onClick={() => handleManualPing(m._id)}
                              title="Ping direct"
                              className="h-7 px-2.5 text-xs"
                            >
                              Ping
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedMonitor(m);
                                setIsModalOpen(true);
                              }}
                              className="w-7 h-7 p-0"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      <MonitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
        initialData={selectedMonitor}
      />
    </div>
  );
}
