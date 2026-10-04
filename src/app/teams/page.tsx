'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Users, ChevronRight, Shield, RefreshCw } from 'lucide-react';

export default function TeamsPage() {
  const { data: teamsData, isLoading } = useQuery({
    queryKey: ['teams-page'],
    queryFn: async () => {
      const res = await api.get('/teams');
      return res.data;
    },
  });

  const teams = teamsData || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <Users className="w-7 h-7 text-emerald-400" />
          <span>Village Cricket Teams</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">Registered village teams and roster details</p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
          <p className="text-xs">Loading teams...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team: any) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-800 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-extrabold text-lg text-emerald-400 border border-slate-700">
                  {team.shortName}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                    {team.name}
                  </h3>
                  <span className="text-xs text-slate-400">{team._count?.players || 0} Registered Players</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
