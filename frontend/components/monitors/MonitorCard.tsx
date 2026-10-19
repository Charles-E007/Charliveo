'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { BadgeStatus } from '../ui/BadgeStatus';
import { api } from '@/lib/api';

export interface MonitorItem {
  _id: string;
  name: string;
  url: string;
  method: string;
  intervalMinutes: number;
  lastStatus?: string;
  lastResponseTimeMs?: number;
  uptimePercentage?: number;
  isActive?: boolean;
  lastCheckedAt?: string;
  lastPingAt?: string;
  headers?: Record<string, string>;
  body?: string;
}

interface MonitorCardProps {
  monitor: MonitorItem;
  onRefresh: () => void;
  onEdit: (monitor: MonitorItem) => void;
}

export const MonitorCard: React.FC<MonitorCardProps> = ({ monitor, onRefresh, onEdit }) => {
  const [pinging, setPinging] = useState(false);
  const [pausing, setPausing] = useState(false);

  const handleManualPing = async () => {
    setPinging(true);
    try {
      await api.post(`/api/v1/monitors/${monitor._id}/ping-now`);
      onRefresh();
    } catch (err) {
      console.error('Erreur lors du ping manuel', err);
    } finally {
      setPinging(false);
    }
  };

  const handleTogglePause = async () => {
    setPausing(true);
    try {
      await api.post(`/api/v1/monitors/${monitor._id}/pause`);
      onRefresh();
    } catch (err) {
      console.error('Erreur lors de la modification de statut', err);
    } finally {
      setPausing(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Supprimer définitivement le moniteur "${monitor.name}" ?`)) {
      try {
        await api.delete(`/api/v1/monitors/${monitor._id}`);
        onRefresh();
      } catch (err) {
        console.error('Erreur lors de la suppression', err);
      }
    }
  };

  const lastPingDate = monitor.lastPingAt || monitor.lastCheckedAt;
  const formattedDate = lastPingDate
    ? new Date(lastPingDate).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '--:--';

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl p-4 flex flex-col justify-between gap-3.5 transition-all duration-150 hover:shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:border-[#D4D4D4]">
      {/* Header : Nom du serveur Roboto 15px/500, badge méthode et statut */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#F2F2F2] text-[#065FD4]">
              {monitor.method || 'GET'}
            </span>
            <h3 className="text-[15px] font-medium text-[#0F0F0F] truncate tracking-tight" title={monitor.name}>
              {monitor.name}
            </h3>
          </div>
          <a
            href={monitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#606060] hover:text-[#065FD4] transition-colors truncate"
            title={monitor.url}
          >
            <span className="material-symbols-outlined text-[14px] shrink-0 text-[#606060]">
              language
            </span>
            <span className="truncate font-mono">{monitor.url}</span>
          </a>
        </div>

        <BadgeStatus status={monitor.isActive ? monitor.lastStatus || 'PENDING' : 'PAUSED'} />
      </div>

      {/* Bloc de métriques : Grille de 3 colonnes sur fond gris surface #F2F2F2 */}
      <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-[#F2F2F2] rounded-lg text-center">
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-normal text-[#606060]">Intervalle</span>
          <div className="flex items-center gap-1 text-xs font-medium text-[#0F0F0F] mt-0.5">
            <span className="material-symbols-outlined text-[13px] text-[#606060]">schedule</span>
            <span>{monitor.intervalMinutes}m</span>
          </div>
        </div>

        <div className="flex flex-col items-center border-x border-[#E5E5E5] px-1">
          <span className="text-[11px] font-normal text-[#606060]">Latence</span>
          <div className="flex items-center gap-1 text-xs font-medium text-[#0F0F0F] mt-0.5">
            <span className="material-symbols-outlined text-[13px] text-[#606060]">bolt</span>
            <span>{monitor.lastResponseTimeMs || 0}ms</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[11px] font-normal text-[#606060]">Uptime</span>
          <div className="flex items-center gap-1 text-xs font-bold text-[#2BA640] mt-0.5">
            <span className="material-symbols-outlined text-[13px]">monitoring</span>
            <span>{monitor.uptimePercentage ?? 100}%</span>
          </div>
        </div>
      </div>

      {/* Dernier ping métadonnée */}
      <div className="flex items-center justify-between text-[11px] text-[#606060] px-0.5">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">history</span>
          <span>Dernier ping : {formattedDate}</span>
        </span>
        <span className="flex items-center gap-1">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              monitor.isActive ? 'bg-[#2BA640]' : 'bg-[#606060]'
            }`}
          />
          <span>{monitor.isActive ? 'Actif' : 'En pause'}</span>
        </span>
      </div>

      {/* Actions footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#E5E5E5]">
        <div className="flex items-center gap-2">
          {/* Action Broadcast Red #FF0000 : Ping Instantané */}
          <Button
            variant="broadcast"
            size="sm"
            onClick={handleManualPing}
            disabled={pinging || !monitor.isActive}
            title="Ping immédiat en direct"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                pinging ? 'animate-spin' : ''
              }`}
            >
              refresh
            </span>
            <span>Ping</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleTogglePause}
            disabled={pausing}
            title={monitor.isActive ? 'Mettre en pause' : 'Réactiver'}
          >
            <span className="material-symbols-outlined text-[16px]">
              {monitor.isActive ? 'pause' : 'play_arrow'}
            </span>
            <span className="hidden sm:inline">
              {monitor.isActive ? 'Pause' : 'Activer'}
            </span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(monitor)}
            title="Modifier le moniteur"
            className="w-8 h-8 p-0"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            title="Supprimer le moniteur"
            className="w-8 h-8 p-0 hover:text-[#FF0000] hover:bg-red-50"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
