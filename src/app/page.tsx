'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { LiveIndicator } from '@/components/ui/LiveIndicator';
import { MatchCard } from '@/components/ui/MatchCard';
import { Trophy, Shield, Calendar, Users, Play, Plus, Activity, ArrowRight, Radio } from 'lucide-react';

export default function HomePage() {
  const { user, hasRole } = useAuth();

  const { data: matchesData, isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const res = await api.get('/matches');
      return res.data;
    },
  });

  const matches = matchesData || [];
  const liveMatch = matches.find((m: any) => m.status === 'LIVE');
  const upcomingMatches = matches.filter((m: any) => m.status === 'SCHEDULED');
  const completedMatches = matches.filter((m: any) => m.status === 'COMPLETED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-card p-6 sm:p-10 border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Village Cricket Match Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Follow Village Cricket <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Live Ball-by-Ball
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg">
            Real-time live scoreboards, match stream links, complete team rosters, and post-match scorecards for our village community.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {liveMatch ? (
              <Link
                href={`/live/${liveMatch.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-extrabold text-base hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-xl shadow-emerald-500/20"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Open Live Match ({liveMatch.teamA.shortName} vs {liveMatch.teamB.shortName})</span>
              </Link>
            ) : (
              <Link
                href="/matches"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-extrabold text-base hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-xl shadow-emerald-500/20"
              >
                <Calendar className="w-5 h-5" />
                <span>View All Fixtures</span>
              </Link>
            )}

            {(hasRole('ADMIN') || hasRole('SCORER')) && (
              <Link
                href="/admin/matches/create"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm hover:bg-slate-700 transition-all"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Create Match</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Active Live Match Banner */}
      {liveMatch && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LiveIndicator />
              <h2 className="text-2xl font-bold text-white">Current Active Match</h2>
            </div>
            <Link
              href={`/live/${liveMatch.slug}`}
              className="text-xs font-bold text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Full Live View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-card rounded-3xl p-6 border-2 border-emerald-500/50 bg-gradient-to-br from-slate-900/90 via-slate-950 to-slate-900 shadow-2xl shadow-emerald-500/10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Teams & Score */}
              <div className="lg:col-span-2 space-y-4">
                <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                  {liveMatch.title} • {liveMatch.venue}
                </span>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center font-extrabold text-emerald-400 text-lg border border-slate-700">
                      {liveMatch.teamA.shortName.slice(0, 3)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-xl text-white">{liveMatch.teamA.name}</h3>
                      <p className="text-xs text-slate-400">{liveMatch.teamA.shortName}</p>
                    </div>
                  </div>

                  {liveMatch.innings && liveMatch.innings[0] && (
                    <div className="text-left sm:text-right">
                      <span className="text-3xl font-black text-white">
                        {liveMatch.innings[0].totalRuns}/{liveMatch.innings[0].totalWickets}
                      </span>
                      <span className="block text-xs font-semibold text-slate-400">
                        Overs: {liveMatch.innings[0].totalOvers} / {liveMatch.totalOvers}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-col justify-center items-center lg:items-end gap-3 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                <Link
                  href={`/live/${liveMatch.slug}`}
                  className="w-full sm:w-auto text-center px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-lg hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Open Live Scoreboard</span>
                </Link>

                {(hasRole('SCORER') || hasRole('ADMIN')) && (
                  <Link
                    href={`/admin/matches/${liveMatch.id}/scoring`}
                    className="w-full sm:w-auto text-center px-6 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold text-xs hover:bg-amber-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Activity className="w-4 h-4" />
                    <span>Open Scorer Console</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Action Tiles */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/matches"
            className="glass-card glass-card-hover p-5 rounded-2xl flex items-center gap-4 border border-slate-800"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Match Fixtures</h3>
              <p className="text-xs text-slate-400">View upcoming fixtures</p>
            </div>
          </Link>

          <Link
            href="/teams"
            className="glass-card glass-card-hover p-5 rounded-2xl flex items-center gap-4 border border-slate-800"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Village Teams</h3>
              <p className="text-xs text-slate-400">Team rosters & squads</p>
            </div>
          </Link>

          {(hasRole('ADMIN') || hasRole('SCORER')) && (
            <Link
              href="/admin/matches/create"
              className="glass-card glass-card-hover p-5 rounded-2xl flex items-center gap-4 border border-emerald-500/30 bg-emerald-500/5"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Schedule Match</h3>
                <p className="text-xs text-slate-400">Create a new fixture</p>
              </div>
            </Link>
          )}

          <Link
            href="/players"
            className="glass-card glass-card-hover p-5 rounded-2xl flex items-center gap-4 border border-slate-800"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Player Leaderboard</h3>
              <p className="text-xs text-slate-400">Batting & bowling stats</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Upcoming Matches Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Upcoming Matches</h2>
          <Link href="/matches" className="text-xs font-bold text-emerald-400 hover:underline">
            View All
          </Link>
        </div>

        {upcomingMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingMatches.slice(0, 4).map((match: any) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center text-slate-400 border border-slate-800">
            No upcoming matches scheduled currently.
          </div>
        )}
      </section>

      {/* Recent Results Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recent Match Results</h2>
          <Link href="/matches" className="text-xs font-bold text-emerald-400 hover:underline">
            View All
          </Link>
        </div>

        {completedMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedMatches.slice(0, 4).map((match: any) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8 text-center text-slate-400 border border-slate-800">
            No completed matches available yet.
          </div>
        )}
      </section>
    </div>
  );
}
