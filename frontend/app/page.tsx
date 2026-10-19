"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import CharliveoLogo from '@/components/ui/CharliveoLogo';

export default function HomePage() {
  const [demoPinging, setDemoPinging] = useState(false);
  const [demoLatency, setDemoLatency] = useState(42);
  const [demoLastPing, setDemoLastPing] = useState("À l'instant");

  const handleDemoPing = () => {
    setDemoPinging(true);
    setTimeout(() => {
      setDemoLatency(Math.floor(Math.random() * 35) + 25);
      setDemoLastPing("À l'instant");
      setDemoPinging(false);
    }, 600);
  };

  return (
    <div className="min-h-[100dvh] bg-white text-[#0F0F0F] flex flex-col selection:bg-red-50 selection:text-[#FF0000]">
      {/* Top Navigation */}
      <header className="h-14 border-b border-[#E5E5E5] bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto h-full px-3.5 sm:px-6 flex items-center justify-between">
          <div className="flex items-center shrink-0">
            <a href="/" className="flex items-center gap-2">
              <CharliveoLogo variant="horizontal" color="#0F0F0F" width={135} height={30} className="sm:hidden" />
              <CharliveoLogo variant="horizontal" color="#0F0F0F" width={160} height={36} className="hidden sm:block" />
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-[#606060]">
            <a href="#features" className="hover:text-[#0F0F0F] transition-colors">Fonctionnalités</a>
            <a href="#demo" className="hover:text-[#0F0F0F] transition-colors">Aperçu en Direct</a>
            <a href="#providers" className="hover:text-[#0F0F0F] transition-colors">Hébergeurs Pris en Charge</a>
          </nav>

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
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-10 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 border-b border-[#E5E5E5]">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-5 sm:gap-6">
          {/* Live broadcast pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F2F2F2] rounded-full text-[11px] sm:text-xs text-[#0F0F0F]">
            <span className="w-2 h-2 rounded-full bg-[#FF0000] animate-ping" />
            <span className="font-medium tracking-wide">SURVEILLANCE EN DIRECT - 24h/7j</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0F0F0F] max-w-3xl leading-[1.2]">
            Ne laissez plus jamais vos serveurs s'endormir.
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-[#606060] max-w-2xl leading-relaxed">
            Charliveo réveille automatiquement vos instances <strong>Render, Railway, Fly.io et Heroku</strong> avec des requêtes programmées et surveille votre disponibilité en temps réel avec des alertes immédiates.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full sm:w-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="broadcast" size="lg" iconRight="arrow_forward" className="w-full sm:w-auto">
                Ouvrir un compte
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" iconLeft="grid_view" className="w-full sm:w-auto">
                Accéder au Dashboard
              </Button>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#E5E5E5]">
            <div className="p-2 sm:p-0">
              <span className="block text-xl sm:text-2xl font-bold text-[#0F0F0F]">99.9%</span>
              <span className="text-[11px] sm:text-xs text-[#606060]">Uptime garanti</span>
            </div>
            <div className="p-2 sm:p-0">
              <span className="block text-xl sm:text-2xl font-bold text-[#0F0F0F]">1 min</span>
              <span className="text-[11px] sm:text-xs text-[#606060]">Intervalle minimum</span>
            </div>
            <div className="p-2 sm:p-0">
              <span className="block text-xl sm:text-2xl font-bold text-[#2BA640]">200 OK</span>
              <span className="text-[11px] sm:text-xs text-[#606060]">Validation statut</span>
            </div>
            <div className="p-2 sm:p-0">
              <span className="block text-xl sm:text-2xl font-bold text-[#FF0000]">0 ms</span>
              <span className="text-[11px] sm:text-xs text-[#606060]">Cold-start évité</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-12 sm:py-16 px-4 sm:px-6 bg-[#F2F2F2] border-b border-[#E5E5E5]">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 sm:gap-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F0F0F]">
              Interface Conforme Red Broadcast Edition
            </h2>
            <p className="text-xs sm:text-sm text-[#606060] mt-1">
              Testez le composant de carte de moniteur en direct ci-dessous :
            </p>
          </div>

          {/* Interactive Monitor Card Demo */}
          <div className="w-full max-w-md bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#F2F2F2] text-[#065FD4]">
                    GET
                  </span>
                  <h3 className="text-[15px] font-medium text-[#0F0F0F] truncate">
                    Production API (Demo)
                  </h3>
                </div>
                <div className="text-xs text-[#606060] truncate font-mono">
                  https://api.my-startup.com/health
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#2BA640] text-white shrink-0">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                <span>UP</span>
              </span>
            </div>

            {/* Metrics Block 3 cols */}
            <div className="grid grid-cols-3 gap-2 py-2 px-2.5 sm:px-3 bg-[#F2F2F2] rounded-lg text-center mb-3">
              <div>
                <span className="text-[10px] sm:text-[11px] text-[#606060]">Intervalle</span>
                <div className="flex items-center justify-center gap-1 text-xs font-medium text-[#0F0F0F] mt-0.5">
                  <span className="material-symbols-outlined text-[13px] text-[#606060]">schedule</span>
                  <span>10m</span>
                </div>
              </div>
              <div className="border-x border-[#E5E5E5] px-1">
                <span className="text-[10px] sm:text-[11px] text-[#606060]">Latence</span>
                <div className="flex items-center justify-center gap-1 text-xs font-medium text-[#0F0F0F] mt-0.5">
                  <span className="material-symbols-outlined text-[13px] text-[#606060]">bolt</span>
                  <span>{demoLatency}ms</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] text-[#606060]">Uptime</span>
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-[#2BA640] mt-0.5">
                  <span className="material-symbols-outlined text-[13px]">monitoring</span>
                  <span>99.98%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#606060] mb-3 px-0.5">
              <span>Dernier ping : {demoLastPing}</span>
              <span className="flex items-center gap-1 text-[#2BA640]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2BA640]" />
                En ligne
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5]">
              <Button
                variant="broadcast"
                size="sm"
                onClick={handleDemoPing}
                disabled={demoPinging}
              >
                <span className={`material-symbols-outlined text-[16px] ${demoPinging ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                <span>Ping Instantané</span>
              </Button>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <span className="material-symbols-outlined text-[18px]">pause</span>
                </Button>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-14 sm:py-20 px-4 sm:px-6 border-b border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto flex flex-col gap-8 sm:gap-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F0F0F]">
              Fonctionnalités Conçues pour les Développeurs
            </h2>
            <p className="text-xs sm:text-sm text-[#606060] mt-2">
              Un système centré sur la donnée, la lisibilité immédiate et la réactivité des requêtes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F2F2F2] text-[#0F0F0F] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">schedule</span>
              </div>
              <h3 className="text-base font-bold text-[#0F0F0F]">Réveil Automatique</h3>
              <p className="text-xs text-[#606060] leading-relaxed">
                Empêche l'endormissement de vos conteneurs après 15 minutes d'inactivité avec des pings périodiques.
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-[#FF0000] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">warning</span>
              </div>
              <h3 className="text-base font-bold text-[#0F0F0F]">Alerte Rouge Immédiate</h3>
              <p className="text-xs text-[#606060] leading-relaxed">
                Le rouge signature est déclenché instantanément en cas d'indisponibilité (serveur DOWN ou code d'erreur HTTP).
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F2F2F2] text-[#0F0F0F] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">bolt</span>
              </div>
              <h3 className="text-base font-bold text-[#0F0F0F]">Latence Précise en ms</h3>
              <p className="text-xs text-[#606060] leading-relaxed">
                Mesure du temps de réponse DNS et socket en temps réel pour détecter les ralentissements serveur.
              </p>
            </div>

            <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#F2F2F2] text-[#0F0F0F] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">terminal</span>
              </div>
              <h3 className="text-base font-bold text-[#0F0F0F]">Headers & JSON Personnalisés</h3>
              <p className="text-xs text-[#606060] leading-relaxed">
                Prend en charge les méthodes GET, POST, HEAD, PUT avec en-têtes d'autorisation Bearer et payloads personnalisés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Providers Section */}
      <section id="providers" className="py-12 sm:py-16 px-4 sm:px-6 bg-[#FFFFFF]">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-5 sm:gap-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#606060]">
            Compatible avec tous les clouds modernes
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[#0F0F0F] font-bold text-sm sm:text-base">
            <span className="px-3.5 py-1.5 bg-[#F2F2F2] rounded-lg">Render</span>
            <span className="px-3.5 py-1.5 bg-[#F2F2F2] rounded-lg">Railway</span>
            <span className="px-3.5 py-1.5 bg-[#F2F2F2] rounded-lg">Fly.io</span>
            <span className="px-3.5 py-1.5 bg-[#F2F2F2] rounded-lg">Heroku</span>
            <span className="px-3.5 py-1.5 bg-[#F2F2F2] rounded-lg">Vercel Serverless</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E5E5E5] py-6 sm:py-8 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#606060]">
          <div className="flex items-center gap-2">
            <a href="/">
              <CharliveoLogo variant="horizontal" color="#0F0F0F" width={120} height={28} />
            </a>
            <span>&bull; Charles Emmanuel &copy; 2026 Tous droits réservés.</span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <Link href="/dashboard" className="hover:text-[#0F0F0F]">Dashboard</Link>
            <Link href="/monitors" className="hover:text-[#0F0F0F]">Moniteurs</Link>
            <Link href="/alerts" className="hover:text-[#0F0F0F]">Alertes</Link>
            <Link href="/settings" className="hover:text-[#0F0F0F]">Paramètres</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
