'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Shield, Plus, Calendar, Activity, Users, Award, Play } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: matchesData } = useQuery({
    queryKey: ['admin-matches'],
    queryFn: async () => {
      const res = await api.get('/matches');
      return res.data;
    },
  });

  const matches = matchesData || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-emerald-400" />
            <span>Admin Control Portal</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">Manage fixtures, scoring consoles, teams, and player rosters</p>
        </div>

        <Link
          href="/admin/matches/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-extrabold text-sm hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Match</span>
        </Link>
      </div>

      {/* Action Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/matches/create"
          className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Schedule Fixture</h3>
          <p className="text-xs text-slate-400">Create new cricket match fixture</p>
        </Link>

        <Link
          href="/teams"
          className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Manage Teams</h3>
          <p className="text-xs text-slate-400">View & edit team rosters</p>
        </Link>

        <Link
          href="/players"
          className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Player Profiles</h3>
          <p className="text-xs text-slate-400">Register new players</p>
        </Link>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">All Fixtures Management</h2>
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
          {matches.map((m: any) => (
            <div key={m.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.status === 'LIVE' ? 'bg-emerald-500 text-slate-950 animate-pulse' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {m.status}
                  </span>
                  <span className="text-xs text-slate-400">{m.venue}</span>
                </div>
                <h3 className="font-bold text-white text-base">{m.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/matches/${m.id}/scoring`}
                  className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition-all inline-flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Scorer Console</span>
                </Link>

                <Link
                  href={`/live/${m.slug}`}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold hover:bg-slate-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Live Score</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
