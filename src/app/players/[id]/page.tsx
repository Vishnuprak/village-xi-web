'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Award, RefreshCw, Trophy } from 'lucide-react';

export default function PlayerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: responseData, isLoading } = useQuery({
    queryKey: ['player-detail', id],
    queryFn: async () => {
      const res = await api.get(`/players/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400 space-y-2">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
        <p className="text-xs">Loading player statistics...</p>
      </div>
    );
  }

  if (!responseData || !responseData.player) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">Player not found.</div>;
  }

  const { player, stats } = responseData;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Bio Box */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center font-black text-2xl text-slate-950">
          #{player.jerseyNumber || '—'}
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">{player.fullName}</h1>
          <span className="text-xs text-slate-400">
            {player.team?.name} • {player.primaryRole} • {player.battingStyle}
          </span>
        </div>
      </div>

      {/* Career Stats Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Aggregated Career Stats</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl font-black text-white">{stats.matches}</span>
            <span className="block text-xs text-slate-400">Matches</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl font-black text-emerald-400">{stats.runs}</span>
            <span className="block text-xs text-slate-400">Total Runs</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl font-black text-amber-400">{stats.strikeRate}</span>
            <span className="block text-xs text-slate-400">Strike Rate</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl font-black text-rose-400">{stats.wickets}</span>
            <span className="block text-xs text-slate-400">Wickets</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-300">Fours (4s)</span>
            <span className="text-lg font-bold text-white">{stats.fours}</span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-300">Sixes (6s)</span>
            <span className="text-lg font-bold text-white">{stats.sixes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
