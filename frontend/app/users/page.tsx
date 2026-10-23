"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import {
  AdminUser,
  RoleBadge,
  UserStatsCard,
  formatMemberSince,
} from '@/components/admin/UserStatsCard';
import { api } from '@/lib/api';
import { clearSession } from '@/lib/session';

interface AdminTotals {
  users: number;
  admins: number;
  monitors: number;
  up: number;
  down: number;
  paused: number;
  pending: number;
  avgLatencyMs: number;
}

const StatTile: React.FC<{
  label: string;
  value: React.ReactNode;
  icon: string;
  valueClass?: string;
  iconClass?: string;
}> = ({
  label,
  value,
  icon,
  valueClass = 'text-[#0F0F0F]',
  iconClass = 'bg-[#F2F2F2] text-[#0F0F0F]',
}) => (
  <div className="bg-white border border-[#E5E5E5] rounded-xl p-3.5 sm:p-4 flex items-center justify-between">
    <div className="flex flex-col min-w-0">
      <span className="text-[11px] sm:text-xs font-normal text-[#606060] truncate">{label}</span>
      <span className={`text-xl sm:text-2xl font-bold mt-0.5 sm:mt-1 ${valueClass}`}>{value}</span>
    </div>
    <div
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${iconClass}`}
    >
      <span className="material-symbols-outlined text-[18px] sm:text-[20px]">{icon}</span>
    </div>
  </div>
);

export default function UsersPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totals, setTotals] = useState<AdminTotals | null>(null);
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'USER'>('ALL');

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileRes = await api.get('/api/v1/auth/me');
      setUser(profileRes.data);

      // Garde côté client : l'API renvoie de toute façon un 403 aux non-admins
      if (profileRes.data?.role !== 'ADMIN') {
        setForbidden(true);
        return;
      }

      const overviewRes = await api.get('/api/v1/admin/users');
      setUsers(overviewRes.data.users || []);
      setTotals(overviewRes.data.totals || null);
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setForbidden(true);
      } else if (err?.response?.status === 404) {
        // La route admin existe en local mais pas encore sur l'API déployée
        console.error(err);
        setError(
          "La route /api/v1/admin/users est absente de l'API interrogée. Le backend doit être redéployé pour exposer le module admin.",
        );
      } else {
        console.error(err);
        setError('Impossible de charger la liste des utilisateurs.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    const matchesSearch =
      u.fullName.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);

    if (!matchesSearch) return false;
    if (roleFilter === 'ALL') return true;
    return u.role === roleFilter;
  });

  const countAdmins = totals?.admins ?? 0;
  const countStandard = (totals?.users ?? 0) - countAdmins;

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
          user={user}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 max-w-7xl pb-24 md:pb-8">
          {/* Titre + action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F0F0F]">
                Utilisateurs
              </h1>
              <p className="text-xs text-[#606060] mt-0.5">
                Vue administrateur : comptes inscrits et activité de surveillance globale
              </p>
            </div>

            {!forbidden && (
              <Button
                variant="secondary"
                size="md"
                onClick={fetchOverview}
                iconLeft="refresh"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <span>Actualiser</span>
              </Button>
            )}
          </div>

          {forbidden ? (
            <div className="py-16 bg-white border border-[#E5E5E5] rounded-xl text-center flex flex-col items-center justify-center gap-3 p-6">
              <div className="w-12 h-12 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#606060]">
                <span className="material-symbols-outlined text-[24px]">lock</span>
              </div>
              <h3 className="text-base font-bold text-[#0F0F0F]">
                Accès réservé aux administrateurs
              </h3>
              <p className="text-xs text-[#606060] max-w-sm">
                Cette page est accessible uniquement aux comptes disposant du rôle ADMIN.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/dashboard')}
                iconLeft="arrow_back"
                className="mt-2 w-full sm:w-auto"
              >
                Retour au tableau de bord
              </Button>
            </div>
          ) : loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[32px] text-[#606060] animate-spin">
                refresh
              </span>
              <span className="text-sm text-[#606060]">Chargement des utilisateurs...</span>
            </div>
          ) : error ? (
            <div className="py-16 bg-white border border-[#E5E5E5] rounded-xl text-center flex flex-col items-center justify-center gap-3 p-6">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-[#FF0000]">
                <span className="material-symbols-outlined text-[24px]">error</span>
              </div>
              <h3 className="text-base font-bold text-[#0F0F0F]">Erreur de chargement</h3>
              <p className="text-xs text-[#606060] max-w-sm">{error}</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={fetchOverview}
                iconLeft="refresh"
                className="mt-2 w-full sm:w-auto"
              >
                Réessayer
              </Button>
            </div>
          ) : (
            <>
              {/* Statistiques globales de la plateforme */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <StatTile label="Utilisateurs inscrits" value={totals?.users ?? 0} icon="group" />
                <StatTile label="Total Moniteurs" value={totals?.monitors ?? 0} icon="grid_view" />
                <StatTile
                  label="En Ligne (UP)"
                  value={totals?.up ?? 0}
                  icon="check_circle"
                  valueClass="text-[#2BA640]"
                  iconClass="bg-green-50 text-[#2BA640]"
                />
                <StatTile
                  label="En Panne (DOWN)"
                  value={totals?.down ?? 0}
                  icon="error"
                  valueClass="text-[#FF0000]"
                  iconClass="bg-red-50 text-[#FF0000]"
                />
                <StatTile
                  label="Latence Moyenne"
                  value={`${totals?.avgLatencyMs ?? 0} ms`}
                  icon="bolt"
                />
              </div>

              {/* Recherche & filtres */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2.5 sm:p-3 bg-[#F2F2F2] rounded-xl">
                <div className="relative flex-1 w-full sm:max-w-md">
                  <span className="material-symbols-outlined text-[18px] text-[#606060] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    className="h-9 w-full bg-white border border-transparent rounded-full pl-9 pr-4 text-xs text-[#0F0F0F] placeholder-[#606060] focus:outline-none focus:border-[#0F0F0F]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setRoleFilter('ALL')}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                      roleFilter === 'ALL'
                        ? 'bg-[#0F0F0F] text-white'
                        : 'bg-white text-[#606060] hover:text-[#0F0F0F]'
                    }`}
                  >
                    Tous ({totals?.users ?? 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter('ADMIN')}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                      roleFilter === 'ADMIN'
                        ? 'bg-[#0F0F0F] text-white'
                        : 'bg-white text-[#606060] hover:text-[#0F0F0F]'
                    }`}
                  >
                    Admins ({countAdmins})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleFilter('USER')}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                      roleFilter === 'USER'
                        ? 'bg-[#0F0F0F] text-white'
                        : 'bg-white text-[#606060] hover:text-[#0F0F0F]'
                    }`}
                  >
                    Utilisateurs ({countStandard})
                  </button>
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="py-16 bg-white border border-[#E5E5E5] rounded-xl text-center flex flex-col items-center justify-center gap-3 p-6">
                  <div className="w-12 h-12 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#606060]">
                    <span className="material-symbols-outlined text-[24px]">person_search</span>
                  </div>
                  <h3 className="text-base font-bold text-[#0F0F0F]">Aucun utilisateur trouvé</h3>
                  <p className="text-xs text-[#606060] max-w-sm">
                    Aucun compte ne correspond à votre recherche ou au filtre sélectionné.
                  </p>
                </div>
              ) : (
                <>
                  {/* Tableau (desktop) */}
                  <div className="hidden md:block bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#F2F2F2]">
                            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#606060]">
                              Utilisateur
                            </th>
                            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#606060]">
                              Rôle
                            </th>
                            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#606060] whitespace-nowrap">
                              Création du compte
                            </th>
                            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#606060] text-center">
                              Moniteurs
                            </th>
                            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#606060] text-center">
                              En ligne
                            </th>
                            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#606060] text-center">
                              En panne
                            </th>
                            <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#606060] text-center whitespace-nowrap">
                              Latence moy.
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u) => (
                            <tr
                              key={u._id}
                              className="border-t border-[#E5E5E5] hover:bg-[#F2F2F2] transition-colors"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-full bg-[#0F0F0F] text-white text-xs font-semibold flex items-center justify-center uppercase shrink-0">
                                    {u.fullName ? u.fullName.charAt(0) : 'U'}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span
                                      className="text-[15px] font-medium text-[#0F0F0F] truncate max-w-[220px]"
                                      title={u.fullName}
                                    >
                                      {u.fullName}
                                    </span>
                                    <span
                                      className="text-xs text-[#606060] truncate max-w-[220px]"
                                      title={u.email}
                                    >
                                      {u.email}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <RoleBadge role={u.role} />
                              </td>
                              <td className="px-4 py-3 text-xs text-[#606060] whitespace-nowrap">
                                {formatMemberSince(u.createdAt)}
                              </td>
                              <td className="px-4 py-3 text-center text-sm font-bold text-[#0F0F0F]">
                                {u.monitorsCount}
                              </td>
                              <td className="px-4 py-3 text-center text-sm font-bold text-[#2BA640]">
                                {u.upCount}
                              </td>
                              <td
                                className={`px-4 py-3 text-center text-sm font-bold ${
                                  u.downCount > 0 ? 'text-[#FF0000]' : 'text-[#0F0F0F]'
                                }`}
                              >
                                {u.downCount}
                              </td>
                              <td className="px-4 py-3 text-center text-sm font-bold text-[#0F0F0F] whitespace-nowrap">
                                {u.avgLatencyMs ? (
                                  <>
                                    {u.avgLatencyMs}
                                    <span className="text-[11px] font-normal text-[#606060]"> ms</span>
                                  </>
                                ) : (
                                  <span className="text-[#606060]">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Cartes (mobile) */}
                  <div className="grid grid-cols-1 gap-3.5 md:hidden">
                    {filteredUsers.map((u) => (
                      <UserStatsCard key={u._id} user={u} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
