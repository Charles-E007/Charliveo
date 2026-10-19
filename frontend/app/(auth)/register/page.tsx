"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import CharliveoLogo from '@/components/ui/CharliveoLogo';
import { api } from '@/lib/api';
import { setSessionToken, getSessionToken } from '@/lib/session';

export default function RegisterPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirection immédiate si déjà connecté
  useEffect(() => {
    const token = getSessionToken();
    if (token) {
      router.replace('/dashboard');
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/v1/auth/register', {
        fullName,
        email,
        password,
      });
      const { accessToken } = response.data;

      setSessionToken(accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#FFFFFF] flex items-center justify-center">
        <span className="material-symbols-outlined text-[32px] text-[#0F0F0F] animate-spin">
          progress_activity
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#FFFFFF] flex flex-col justify-between p-4 sm:p-6">
      {/* Top Header Logo */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <Link href="/" className="flex items-center shrink-0">
          <CharliveoLogo variant="horizontal" color="#0F0F0F" width={135} height={30} className="sm:hidden" />
          <CharliveoLogo variant="horizontal" color="#0F0F0F" width={160} height={36} className="hidden sm:block" />
        </Link>

        <Link href="/login">
          <Button variant="ghost" size="sm" className="text-xs px-2.5 sm:px-3">
            Se connecter
          </Button>
        </Link>
      </div>

      {/* Main Register Form Card */}
      <div className="w-full max-w-md mx-auto my-auto py-4">
        <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 sm:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col items-center text-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#F2F2F2] flex items-center justify-center text-[#0F0F0F] mb-1">
              <span className="material-symbols-outlined text-[24px]">person_add</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F0F0F]">Créer un compte</h1>
            <p className="text-xs text-[#606060]">
              Configurez vos pings et gardez vos serveurs réveillés 24/7
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-[#FF0000] text-xs rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-sm font-medium text-[#0F0F0F]">Nom complet</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-[18px] text-[#606060] absolute left-3 pointer-events-none">
                  person
                </span>
                <input
                  type="text"
                  className="h-10 bg-[#F2F2F2] border border-transparent rounded-lg pl-9 pr-3.5 text-sm text-[#0F0F0F] placeholder-[#606060] focus:outline-none focus:border-[#0F0F0F] focus:bg-white w-full transition-colors"
                  placeholder="Alexandre Dupont"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-sm font-medium text-[#0F0F0F]">Adresse Email</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-[18px] text-[#606060] absolute left-3 pointer-events-none">
                  email
                </span>
                <input
                  type="email"
                  className="h-10 bg-[#F2F2F2] border border-transparent rounded-lg pl-9 pr-3.5 text-sm text-[#0F0F0F] placeholder-[#606060] focus:outline-none focus:border-[#0F0F0F] focus:bg-white w-full transition-colors"
                  placeholder="alex@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-sm font-medium text-[#0F0F0F]">Mot de passe</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-[18px] text-[#606060] absolute left-3 pointer-events-none">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="h-10 bg-[#F2F2F2] border border-transparent rounded-lg pl-9 pr-10 text-sm text-[#0F0F0F] placeholder-[#606060] focus:outline-none focus:border-[#0F0F0F] focus:bg-white w-full transition-colors"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#606060] hover:text-[#0F0F0F] flex items-center justify-center p-0.5"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-sm font-medium text-[#0F0F0F]">Confirmer le mot de passe</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-[18px] text-[#606060] absolute left-3 pointer-events-none">
                  lock_reset
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="h-10 bg-[#F2F2F2] border border-transparent rounded-lg pl-9 pr-10 text-sm text-[#0F0F0F] placeholder-[#606060] focus:outline-none focus:border-[#0F0F0F] focus:bg-white w-full transition-colors"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 text-[#606060] hover:text-[#0F0F0F] flex items-center justify-center p-0.5"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2"
              iconLeft="person_add"
            >
              <span>{loading ? 'Création du compte...' : 'Créer mon compte'}</span>
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-[#E5E5E5] text-center">
            <p className="text-xs text-[#606060]">
              Déjà inscrit ?{' '}
              <Link href="/login" className="text-[#065FD4] font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full text-center py-2 text-xs text-[#606060]">
        Charliveo &bull; Server Ping & Uptime Monitor
      </div>
    </div>
  );
}
