'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { MatchCard } from '@/components/ui/MatchCard';
import { Calendar, Filter, RefreshCw } from 'lucide-react';

export default function MatchesPage() {
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'SCHEDULED' | 'COMPLETED'>('ALL');

  const { data: matchesData, isLoading } = useQuery({
    queryKey: ['matches-page'],
    queryFn: async () => {
      const res = await api.get('/matches');
      return res.data;
    },
  });

  const matches = matchesData || [];
  const filteredMatches = filter === 'ALL' ? matches : matches.filter((m: any) => m.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-7 h-7 text-emerald-400" />
            <span>Cricket Match Fixtures</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">All village fixtures, live matches, and historical results</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          {(['ALL', 'LIVE', 'SCHEDULED', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === tab
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
          <p className="text-xs">Loading fixtures...</p>
        </div>
      ) : filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((match: any) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-12 text-center text-slate-400 border border-slate-800">
          No matches found under filter: {filter}
        </div>
      )}
    </div>
  );
}
