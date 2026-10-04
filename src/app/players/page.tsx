'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Award, ChevronRight, RefreshCw } from 'lucide-react';

export default function PlayersPage() {
  const { data: playersData, isLoading } = useQuery({
    queryKey: ['players-page'],
    queryFn: async () => {
      const res = await api.get('/players');
      return res.data;
    },
  });

  const players = playersData || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Award className="w-7 h-7 text-emerald-400" />
          <span>Village Player Leaderboard</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">Registered village players & career performance stats</p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
          <p className="text-xs">Loading players...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {players.map((p: any) => (
            <Link
              key={p.id}
              href={`/players/${p.id}`}
              className="glass-card glass-card-hover p-4 rounded-xl border border-slate-800 flex items-center justify-between group"
            >
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                  {p.fullName}
                </h3>
                <span className="text-xs text-slate-400">{p.team?.name} • {p.primaryRole}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
