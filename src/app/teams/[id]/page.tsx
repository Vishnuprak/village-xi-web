'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Users, Shield, RefreshCw } from 'lucide-react';

export default function TeamDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: team, isLoading } = useQuery({
    queryKey: ['team-detail', id],
    queryFn: async () => {
      const res = await api.get(`/teams/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-400 space-y-2">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
        <p className="text-xs">Loading team details...</p>
      </div>
    );
  }

  if (!team) {
    return <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-400">Team not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Team Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-2xl text-emerald-400">
          {team.shortName}
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">{team.name}</h1>
          <span className="text-xs text-slate-400">{team.homeGround || 'Village Oval'} • {team.players?.length || 0} Players</span>
        </div>
      </div>

      {/* Roster Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Squad Roster</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {team.players?.map((player: any) => (
            <Link
              key={player.id}
              href={`/players/${player.id}`}
              className="glass-card glass-card-hover p-4 rounded-xl border border-slate-800 flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold text-white text-sm">{player.fullName}</h3>
                <span className="text-xs text-slate-400">{player.primaryRole}</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                #{player.jerseyNumber || '—'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
