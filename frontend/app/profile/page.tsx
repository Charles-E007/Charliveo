"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { clearSession } from '@/lib/session';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal de confirmation de suppression de compte
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/api/v1/auth/me')
      .then((res) => {
        setUser(res.data);
        setFullName(res.data.fullName || '');
        setEmail(res.data.email || '');
      })
      .catch(() => {});
  }, []);

  // Enregistrement des modifications du nom en base de données
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Le nom complet ne peut pas être vide.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await api.put('/api/v1/auth/profile', {
        fullName: fullName.trim(),
      });
      setUser(res.data);
      setFullName(res.data.fullName || fullName.trim());
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      setError(
        err.response?.data?.message ||
        "Une erreur est survenue lors de l'enregistrement des modifications."
      );
    } finally {
      setLoading(false);
    }
  };

  // Suppression de compte avec confirmation, nettoyage de session et redirection vers /
  const handleConfirmDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);

    try {
      await api.delete('/api/v1/auth/account');
      clearSession();
      setShowDeleteModal(false);
      router.push('/');
    } catch (err: any) {
      console.error('Erreur lors de la suppression du compte:', err);
      setDeleteError(
        err.response?.data?.message ||
        'Impossible de supprimer votre compte pour le moment. Veuillez réessayer.'
      );
      setDeleting(false);
    }
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

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 max-w-4xl pb-24 md:pb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F0F0F]">
              Mon Profil
            </h1>
            <p className="text-xs text-[#606060] mt-0.5">
              Consultez et modifiez vos informations personnelles
            </p>
          </div>

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 text-[#2BA640] text-xs font-medium rounded-lg flex items-center gap-2 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>Modifications enregistrées avec succès en base de données.</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#FF0000] text-xs font-medium rounded-lg flex items-center gap-2 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3.5 sm:gap-4 pb-4 sm:pb-5 border-b border-[#E5E5E5]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0F0F0F] text-white flex items-center justify-center font-bold text-lg sm:text-xl uppercase shadow-inner shrink-0">
                {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-[#0F0F0F] truncate">{fullName || 'Utilisateur'}</h2>
                <p className="text-xs text-[#606060] truncate">{email || 'email@example.com'}</p>
                <span className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-green-50 text-[#2BA640] text-[11px] font-medium rounded-full w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2BA640]" />
                  Compte actif
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nom complet"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (error) setError(null);
                  }}
                  required
                  placeholder="Ex: Charles Emmanuel"
                />
                <Input
                  label="Adresse Email"
                  type="email"
                  value={email}
                  disabled
                  className="bg-[#EAEAEA] cursor-not-allowed opacity-75"
                  hint="L'email ne peut pas être modifié directement."
                />
              </div>

              <div className="pt-4 border-t border-[#E5E5E5] flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  iconLeft={loading ? 'sync' : 'save'}
                  className="w-full sm:w-auto"
                >
                  <span>{loading ? 'Enregistrement en cours...' : 'Sauvegarder les modifications'}</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Account Info Card */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 sm:p-6 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-[#0F0F0F]">Informations du Compte</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 bg-[#F2F2F2] rounded-lg flex flex-col gap-1">
                <span className="text-[11px] font-medium text-[#606060]">Type de compte</span>
                <span className="text-xs font-bold text-[#0F0F0F]">Gratuit</span>
              </div>
              <div className="p-3.5 bg-[#F2F2F2] rounded-lg flex flex-col gap-1">
                <span className="text-[11px] font-medium text-[#606060]">Membre depuis</span>
                <span className="text-xs font-bold text-[#0F0F0F]">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white border border-red-200 rounded-xl p-4 sm:p-6 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-[#FF0000] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>Zone de Danger</span>
            </h3>
            <p className="text-xs text-[#606060]">
              La suppression de votre compte est irréversible. Toutes vos données, moniteurs actifs et historiques de pings seront définitivement effacés de la base de données.
            </p>
            <div className="flex justify-end pt-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  setDeleteError(null);
                  setShowDeleteModal(true);
                }}
                className="w-full sm:w-auto"
              >
                <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                <span>Supprimer mon compte</span>
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal for Account Deletion */}
      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#E5E5E5] flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-red-100 text-[#FF0000] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[24px]">delete_forever</span>
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-[#0F0F0F]">
                  Confirmer la suppression du compte ?
                </h3>
                <p className="text-xs text-[#606060] mt-1 leading-relaxed">
                  Cette action est <strong>définitive et irréversible</strong>. Votre compte, vos moniteurs et l'ensemble de votre historique seront immédiatement supprimés.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 text-[#FF0000] text-xs font-medium rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-[#E5E5E5]">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={deleting}
                onClick={handleConfirmDeleteAccount}
                className="w-full sm:w-auto"
              >
                {deleting ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    <span>Suppression en cours...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Oui, supprimer définitivement</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
