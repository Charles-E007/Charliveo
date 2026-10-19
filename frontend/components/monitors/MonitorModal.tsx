"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { MonitorItem } from './MonitorCard';
import { api } from '@/lib/api';

interface MonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: MonitorItem | null;
}

export const MonitorModal: React.FC<MonitorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    method: 'GET',
    intervalMinutes: 10,
    headers: '{}',
    body: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        url: initialData.url || '',
        method: initialData.method || 'GET',
        intervalMinutes: initialData.intervalMinutes || 10,
        headers: initialData.headers ? JSON.stringify(initialData.headers, null, 2) : '{}',
        body: initialData.body || '',
      });
    } else {
      setFormData({
        name: '',
        url: '',
        method: 'GET',
        intervalMinutes: 10,
        headers: '{}',
        body: '',
      });
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let parsedHeaders = {};
      if (formData.headers.trim()) {
        try {
          parsedHeaders = JSON.parse(formData.headers);
        } catch {
          throw new Error('Les en-têtes (Headers) doivent être un objet JSON valide');
        }
      }

      const payload = {
        name: formData.name,
        url: formData.url,
        method: formData.method,
        intervalMinutes: Number(formData.intervalMinutes),
        headers: parsedHeaders,
        body: formData.body.trim() || undefined,
      };

      if (initialData?._id) {
        await api.patch(`/api/v1/monitors/${initialData._id}`, payload);
      } else {
        await api.post('/api/v1/monitors', payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white border border-[#E5E5E5] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.16)] p-5 sm:p-6 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#0F0F0F]">
              {initialData ? 'edit' : 'add_circle'}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#0F0F0F]">
              {initialData ? 'Modifier le Moniteur' : 'Nouveau Moniteur'}
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#606060] hover:bg-[#F2F2F2] hover:text-[#0F0F0F] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-[#FF0000] text-xs rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 sm:gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm font-medium text-[#0F0F0F]">Nom du service</label>
            <input
              type="text"
              placeholder="Ex: API Backend Render"
              required
              className="h-10 bg-[#F2F2F2] border border-transparent rounded-lg px-3.5 text-sm text-[#0F0F0F] placeholder-[#606060] focus:outline-none focus:border-[#0F0F0F] focus:bg-white transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm font-medium text-[#0F0F0F]">URL Cible (Endpoint)</label>
            <input
              type="url"
              placeholder="https://my-service.onrender.com/health"
              required
              className="h-10 bg-[#F2F2F2] border border-transparent rounded-lg px-3.5 text-sm text-[#0F0F0F] placeholder-[#606060] focus:outline-none focus:border-[#0F0F0F] focus:bg-white transition-colors font-mono"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-medium text-[#0F0F0F]">Méthode HTTP</label>
              <select
                className="h-10 bg-[#F2F2F2] border border-transparent rounded-lg px-3 text-sm text-[#0F0F0F] focus:outline-none focus:border-[#0F0F0F] focus:bg-white transition-colors"
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="HEAD">HEAD</option>
                <option value="PUT">PUT</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-medium text-[#0F0F0F]">Intervalle (Min)</label>
              <input
                type="number"
                min={1}
                max={60}
                required
                className="h-10 bg-[#F2F2F2] border border-transparent rounded-lg px-3.5 text-sm text-[#0F0F0F] focus:outline-none focus:border-[#0F0F0F] focus:bg-white transition-colors"
                value={formData.intervalMinutes}
                onChange={(e) => setFormData({ ...formData, intervalMinutes: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm font-medium text-[#0F0F0F]">
              En-têtes HTTP (JSON)
            </label>
            <textarea
              rows={2}
              className="font-mono text-xs leading-4 bg-[#F8F8F8] border border-[#E5E5E5] rounded-lg p-2.5 text-[#0F0F0F] focus:outline-none focus:border-[#0F0F0F] focus:bg-white transition-colors"
              placeholder='{ "Authorization": "Bearer token" }'
              value={formData.headers}
              onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
            />
          </div>

          {(formData.method === 'POST' || formData.method === 'PUT') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm font-medium text-[#0F0F0F]">
                Payload / Body (JSON)
              </label>
              <textarea
                rows={2}
                className="font-mono text-xs leading-4 bg-[#F8F8F8] border border-[#E5E5E5] rounded-lg p-2.5 text-[#0F0F0F] focus:outline-none focus:border-[#0F0F0F] focus:bg-white transition-colors"
                placeholder='{ "status": "ping" }'
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              />
            </div>
          )}

          <div className="flex justify-end items-center gap-2.5 mt-2 pt-4 border-t border-[#E5E5E5]">
            <Button type="button" variant="secondary" onClick={onClose} className="px-3.5 text-xs">
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              iconLeft={initialData ? 'save' : 'add'}
              className="px-4 text-xs"
            >
              <span>{loading ? 'Enregistrement...' : initialData ? 'Sauvegarder' : 'Créer'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
