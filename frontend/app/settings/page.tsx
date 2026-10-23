"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { clearSession } from '@/lib/session';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'api'>('notifications');

  const [discordWebhook, setDiscordWebhook] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);

  const [success, setSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const mockApiKey = 'ka_live_9f81a7b420e6c5188d234a9b';

  useEffect(() => {
    api
      .get('/api/v1/auth/me')
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {});
  }, []);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
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
          user={user}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 max-w-4xl pb-24 md:pb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F0F0F]">
              Paramètres
            </h1>
            <p className="text-xs text-[#606060] mt-0.5">
              Gérez vos canaux d'alerte et vos clés d'API
            </p>
          </div>

          <div className="flex items-center gap-1 border-b border-[#E5E5E5] pb-2 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-[#0F0F0F] text-white'
                  : 'text-[#606060] hover:text-[#0F0F0F] hover:bg-[#F2F2F2]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">notifications</span>
              <span>Alertes & Webhooks</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('api')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'api'
                  ? 'bg-[#0F0F0F] text-white'
                  : 'text-[#606060] hover:text-[#0F0F0F] hover:bg-[#F2F2F2]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">key</span>
              <span>Clés API</span>
            </button>
          </div>

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-[#2BA640] text-xs font-medium rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Modifications enregistrées avec succès.</span>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-6 flex flex-col gap-5">
              <div>
                <h3 className="text-sm font-bold text-[#0F0F0F]">Canaux de Notification d'Incidents</h3>
                <p className="text-xs text-[#606060]">
                  Configurez où recevoir les alertes rouges dès qu'un service est détecté DOWN.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-3.5 bg-[#F2F2F2] rounded-lg gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0F0F0F]">Alertes par Email</span>
                    <span className="text-[11px] text-[#606060]">
                      Envoyer un email immédiat en cas de panne critique.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-[#FF0000] cursor-pointer shrink-0"
                  />
                </div>

                <Input
                  label="URL Webhook Discord"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={discordWebhook}
                  onChange={(e) => setDiscordWebhook(e.target.value)}
                  hint="Un ping sera envoyé dans le salon spécifié lors de chaque changement d'état."
                />

                <div className="pt-4 border-t border-[#E5E5E5] flex justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      setSuccess(true);
                      setTimeout(() => setSuccess(false), 2000);
                    }}
                    iconLeft="check"
                    className="w-full sm:w-auto"
                  >
                    Enregistrer les Webhooks
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-6 flex flex-col gap-5">
              <div>
                <h3 className="text-sm font-bold text-[#0F0F0F]">Clés d'API & Intégration CLI</h3>
                <p className="text-xs text-[#606060]">
                  Utilisez ce jeton pour automatiser vos pings et synchroniser vos moniteurs via script.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-[#0F0F0F]">Jeton API Actif</label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={mockApiKey}
                    className="h-10 bg-[#F2F2F2] border border-[#E5E5E5] rounded-lg px-3.5 text-xs font-mono text-[#0F0F0F] flex-1 focus:outline-none"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={handleCopyApiKey}
                    iconLeft={copiedKey ? 'check' : 'content_copy'}
                    className="w-full sm:w-auto"
                  >
                    <span>{copiedKey ? 'Copié !' : 'Copier'}</span>
                  </Button>
                </div>
              </div>

              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-[#FF0000] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span>Régénérer cette clé invalidera immédiatement toutes les requêtes actives.</span>
                <Button variant="danger" size="sm" className="w-full sm:w-auto shrink-0">
                  Régénérer la clé
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
