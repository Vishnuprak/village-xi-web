'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LiveIndicator } from '@/components/ui/LiveIndicator';
import { Play, Calendar, MapPin, Award, RefreshCw } from 'lucide-react';

export default function MatchDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: match, isLoading } = useQuery({
    queryKey: ['match-detail', slug],
    queryFn: async () => {
      const res = await api.get(`/matches/${slug}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-2">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
        <p className="text-slate-400 text-xs">Loading match details...</p>
      </div>
    );
  }

  if (!match) {
    return <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-400">Match not found.</div>;
  }

  const isLive = match.status === 'LIVE';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Box */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLive ? <LiveIndicator /> : <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-300">{match.status}</span>}
            <span className="text-xs font-semibold text-slate-400">{match.format} • {match.totalOvers} Overs</span>
          </div>

          {isLive && (
            <Link
              href={`/live/${match.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-extrabold text-xs shadow-md shadow-emerald-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Live Score</span>
            </Link>
          )}
        </div>

        <h1 className="text-2xl font-black text-white">{match.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800 pt-3">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            {match.venue}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {new Date(match.scheduledAt).toLocaleString()}
          </span>
        </div>

        {match.resultSummary && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
            {match.resultSummary}
          </div>
        )}
      </div>

      {/* Innings Scorecards */}
      {match.innings && match.innings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Scorecard Breakdown</h2>
          {match.innings.map((inn: any) => (
            <div key={inn.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="font-bold text-base text-emerald-400">
                  Innings {inn.inningsNumber}: {inn.battingTeam?.name}
                </h3>
                <span className="text-lg font-black text-white">
                  {inn.totalRuns}/{inn.totalWickets} ({inn.totalOvers} ov)
                </span>
              </div>
              <p className="text-xs text-slate-400">Bowling Team: {inn.bowlingTeam?.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
