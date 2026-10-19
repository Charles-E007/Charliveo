"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { MonitorCard, MonitorItem } from '@/components/monitors/MonitorCard';
import { MonitorModal } from '@/components/monitors/MonitorModal';
import { api } from '@/lib/api';
import { clearSession } from '@/lib/session';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [monitors, setMonitors] = useState<MonitorItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UP' | 'DOWN' | 'PAUSED'>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonitor, setSelectedMonitor] = useState<MonitorItem | null>(null);

  const fetchProfileAndMonitors = async () => {
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
    fetchProfileAndMonitors();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedMonitor(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (monitor: MonitorItem) => {
    setSelectedMonitor(monitor);
    setIsModalOpen(true);
  };

  const filteredMonitors = monitors.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.url.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PAUSED') return !m.isActive;
    return m.isActive && m.lastStatus === statusFilter;
  });

  const countUp = monitors.filter((m) => m.isActive && m.lastStatus === 'UP').length;
  const countDown = monitors.filter((m) => m.isActive && m.lastStatus === 'DOWN').length;
  const countPaused = monitors.filter((m) => !m.isActive).length;

  const avgLatency = monitors.length
    ? Math.round(
        monitors.reduce((acc, m) => acc + (m.lastResponseTimeMs || 0), 0) / monitors.length,
      )
    : 0;

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
          {/* Header Title + Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F0F0F]">
                Tableau de bord
              </h1>
              <p className="text-xs text-[#606060] mt-0.5">
                Surveillance continue et réveil automatique de vos instances d'hébergement
              </p>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleOpenCreateModal}
              iconLeft="add"
              className="w-full sm:w-auto"
            >
              <span>Nouveau Moniteur</span>
            </Button>
          </div>

          {/* 4 Stat Cards : 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-3.5 sm:p-4 flex items-center justify-between">
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] sm:text-xs font-normal text-[#606060] truncate">Total Moniteurs</span>
                <span className="text-xl sm:text-2xl font-bold text-[#0F0F0F] mt-0.5 sm:mt-1">{monitors.length}</span>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#0F0F0F] shrink-0">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">grid_view</span>
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-xl p-3.5 sm:p-4 flex items-center justify-between">
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] sm:text-xs font-normal text-[#606060] truncate">En Ligne (UP)</span>
                <span className="text-xl sm:text-2xl font-bold text-[#2BA640] mt-0.5 sm:mt-1">{countUp}</span>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-green-50 flex items-center justify-center text-[#2BA640] shrink-0">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">check_circle</span>
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-xl p-3.5 sm:p-4 flex items-center justify-between">
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] sm:text-xs font-normal text-[#606060] truncate">En Panne (DOWN)</span>
                <span className="text-xl sm:text-2xl font-bold text-[#FF0000] mt-0.5 sm:mt-1">{countDown}</span>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-50 flex items-center justify-center text-[#FF0000] shrink-0">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">error</span>
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-xl p-3.5 sm:p-4 flex items-center justify-between">
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] sm:text-xs font-normal text-[#606060] truncate">Latence Moyenne</span>
                <span className="text-xl sm:text-2xl font-bold text-[#0F0F0F] mt-0.5 sm:mt-1">{avgLatency} ms</span>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#0F0F0F] shrink-0">
                <span className="material-symbols-outlined text-[18px] sm:text-[20px]">bolt</span>
              </div>
            </div>
          </div>

          {/* Search & Filters Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2.5 sm:p-3 bg-[#F2F2F2] rounded-xl">
            <div className="relative flex-1 w-full sm:max-w-md">
              <span className="material-symbols-outlined text-[18px] text-[#606060] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Rechercher par nom ou URL..."
                className="h-9 w-full bg-white border border-transparent rounded-full pl-9 pr-4 text-xs text-[#0F0F0F] placeholder-[#606060] focus:outline-none focus:border-[#0F0F0F]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-[#0F0F0F] text-white'
                    : 'bg-white text-[#606060] hover:text-[#0F0F0F]'
                }`}
              >
                Tous ({monitors.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('UP')}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  statusFilter === 'UP'
                    ? 'bg-[#2BA640] text-white'
                    : 'bg-white text-[#606060] hover:text-[#2BA640]'
                }`}
              >
                En Ligne ({countUp})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('DOWN')}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  statusFilter === 'DOWN'
                    ? 'bg-[#FF0000] text-white'
                    : 'bg-white text-[#606060] hover:text-[#FF0000]'
                }`}
              >
                En Panne ({countDown})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('PAUSED')}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                  statusFilter === 'PAUSED'
                    ? 'bg-[#606060] text-white'
                    : 'bg-white text-[#606060] hover:text-[#0F0F0F]'
                }`}
              >
                En Pause ({countPaused})
              </button>
            </div>
          </div>

          {/* Content : Loading, Empty, or Cards Grid */}
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[32px] text-[#606060] animate-spin">
                refresh
              </span>
              <span className="text-sm text-[#606060]">Chargement des moniteurs...</span>
            </div>
          ) : filteredMonitors.length === 0 ? (
            <div className="py-16 bg-white border border-[#E5E5E5] rounded-xl text-center flex flex-col items-center justify-center gap-3 p-6">
              <div className="w-12 h-12 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#606060]">
                <span className="material-symbols-outlined text-[24px]">monitoring</span>
              </div>
              <h3 className="text-base font-bold text-[#0F0F0F]">Aucun moniteur configuré</h3>
              <p className="text-xs text-[#606060] max-w-sm">
                Créez votre premier moniteur pour surveiller vos serveurs et éviter les cold-starts.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenCreateModal}
                iconLeft="add"
                className="mt-2 w-full sm:w-auto"
              >
                Créer un Moniteur
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredMonitors.map((m) => (
                <MonitorCard
                  key={m._id}
                  monitor={m}
                  onRefresh={fetchProfileAndMonitors}
                  onEdit={handleOpenEditModal}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <MonitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProfileAndMonitors}
        initialData={selectedMonitor}
      />
    </div>
  );
}
