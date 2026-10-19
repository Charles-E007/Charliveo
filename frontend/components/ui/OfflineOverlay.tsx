"use client";

import React, { useEffect, useState } from 'react';
import Loader from './Loader';

export function OfflineOverlay() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Vérification de l'état réseau initial
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }

    const handleOnline = () => {
      setIsOffline(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-[99999] bg-[#0F0F0F]/85 backdrop-blur-md flex items-center justify-center p-4 selection:bg-transparent"
    >
      <div className="max-w-md w-full bg-[#181818] border border-[#2B2B2B] rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-4 flex items-center justify-center">
          <Loader />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/70 border border-red-500/30 rounded-full text-[11px] font-semibold text-red-400 mb-3 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#FF0000] animate-ping" />
          <span>Connexion réseau interrompue</span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
          Aucune connexion Internet
        </h2>

        <p className="text-xs text-[#A0A0A0] leading-relaxed max-w-xs mb-6">
          Votre appareil est actuellement déconnecté. Cette animation disparaîtra automatiquement dès que la connexion sera rétablie.
        </p>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && navigator.onLine) {
              setIsOffline(false);
            }
          }}
          className="px-4 py-2 bg-white hover:bg-[#F2F2F2] text-[#0F0F0F] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow"
        >
          <span className="material-symbols-outlined text-[16px]">wifi_find</span>
          <span>Vérifier la connexion</span>
        </button>
      </div>
    </div>
  );
}
