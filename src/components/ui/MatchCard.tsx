'use client';

import React from 'react';
import Link from 'next/link';
import { LiveIndicator } from './LiveIndicator';
import { Calendar, MapPin, Play, ChevronRight, Share2 } from 'lucide-react';

interface MatchCardProps {
  match: {
    id: string;
    slug: string;
    title: string;
    venue: string;
    scheduledAt: string;
    totalOvers: number;
    status: 'DRAFT' | 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
    resultSummary?: string;
    liveStreamUrl?: string;
    teamA: { name: string; shortName: string; logoUrl?: string };
    teamB: { name: string; shortName: string; logoUrl?: string };
    innings?: Array<{
      inningsNumber: number;
      totalRuns: number;
      totalWickets: number;
      totalOvers: number;
      battingTeamId: string;
    }>;
  };
}

export function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status === 'LIVE';
  const isCompleted = match.status === 'COMPLETED';

  const innings1 = match.innings?.find((i) => i.inningsNumber === 1);
  const innings2 = match.innings?.find((i) => i.inningsNumber === 2);

  return (
    <div className={`glass-card glass-card-hover rounded-2xl p-5 relative overflow-hidden ${isLive ? 'border-emerald-500/40' : ''}`}>
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {isLive ? (
            <LiveIndicator />
          ) : (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isCompleted
                  ? 'bg-slate-800 text-slate-300'
                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              }`}
            >
              {match.status}
            </span>
          )}
          <span className="text-xs font-medium text-slate-400">{match.totalOvers} Overs Match</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate max-w-[140px] sm:max-w-none">{match.venue}</span>
        </div>
      </div>

      {/* Teams & Score Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center mb-4">
        {/* Team A */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-emerald-400 border border-slate-700">
              {match.teamA.shortName.slice(0, 3)}
            </div>
            <div>
              <h4 className="font-bold text-base text-white">{match.teamA.name}</h4>
              <span className="text-xs text-slate-400">{match.teamA.shortName}</span>
            </div>
          </div>
          {innings1 && (
            <div className="text-right">
              <span className="text-lg font-extrabold text-white">
                {innings1.totalRuns}/{innings1.totalWickets}
              </span>
              <span className="block text-[11px] text-slate-400">({innings1.totalOvers} ov)</span>
            </div>
          )}
        </div>

        {/* Team B */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-sm text-amber-400 border border-slate-700">
              {match.teamB.shortName.slice(0, 3)}
            </div>
            <div>
              <h4 className="font-bold text-base text-white">{match.teamB.name}</h4>
              <span className="text-xs text-slate-400">{match.teamB.shortName}</span>
            </div>
          </div>
          {innings2 && (
            <div className="text-right">
              <span className="text-lg font-extrabold text-white">
                {innings2.totalRuns}/{innings2.totalWickets}
              </span>
              <span className="block text-[11px] text-slate-400">({innings2.totalOvers} ov)</span>
            </div>
          )}
        </div>
      </div>

      {/* Result Summary if completed */}
      {isCompleted && match.resultSummary && (
        <div className="mb-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
          <span className="text-xs font-bold text-emerald-400">{match.resultSummary}</span>
        </div>
      )}

      {/* Footer Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(match.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <div className="flex items-center gap-2">
          {isLive ? (
            <Link
              href={`/live/${match.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-extrabold text-xs hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-md shadow-emerald-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Watch Live Score</span>
            </Link>
          ) : (
            <Link
              href={`/matches/${match.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-colors"
            >
              <span>Match Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
