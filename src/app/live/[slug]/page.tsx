'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useLiveSocket } from '@/hooks/use-socket';
import { LiveIndicator } from '@/components/ui/LiveIndicator';
import { Share2, Copy, Check, Tv, MapPin, Calendar, Award, RefreshCw } from 'lucide-react';

export default function PublicLivePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [copied, setCopied] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);

  // Initial REST Query
  const { data: initialData, isLoading, refetch } = useQuery({
    queryKey: ['live-match', slug],
    queryFn: async () => {
      const res = await api.get(`/matches/${slug}/live`);
      return res.data;
    },
  });

  useEffect(() => {
    if (initialData) {
      setLiveData(initialData);
    }
  }, [initialData]);

  // Real-time WebSocket hook
  const { isConnected } = useLiveSocket(liveData?.matchId, (updatedData) => {
    if (updatedData) {
      setLiveData(updatedData);
    }
  });

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== 'undefined' && liveData) {
      const text = `🏏 Live Cricket Score: ${liveData.teamA.shortName} vs ${liveData.teamB.shortName}\n${liveData.currentInnings ? `${liveData.currentInnings.battingTeam.shortName}: ${liveData.currentInnings.totalRuns}/${liveData.currentInnings.totalWickets} (${liveData.currentInnings.totalOvers} ov)` : ''}\nFollow live score here: ${window.location.href}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  if (isLoading && !liveData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
        <p className="text-slate-400 font-medium">Loading live scoreboard...</p>
      </div>
    );
  }

  if (!liveData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Live Match Not Found</h2>
        <p className="text-slate-400">The requested live match link is invalid or expired.</p>
      </div>
    );
  }

  const currentInnings = liveData.currentInnings;
  const isLive = liveData.status === 'LIVE';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner & Status */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {isLive ? <LiveIndicator /> : <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-300">{liveData.status}</span>}
            <span className="text-xs font-semibold text-slate-400">{isConnected ? '• Real-Time Connected' : '• Connecting...'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Teams Score Overview Header */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-white">{liveData.title}</h1>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {liveData.venue}
            </span>
            <span>• {liveData.totalOvers} Overs Format</span>
          </div>
        </div>

        {/* Score Display Card */}
        {currentInnings ? (
          <div className="mt-6 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Current Innings: {currentInnings.battingTeam.name}
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                    {currentInnings.totalRuns}/{currentInnings.totalWickets}
                  </span>
                  <span className="text-xl font-extrabold text-slate-400">
                    ({currentInnings.totalOvers} / {liveData.totalOvers} ov)
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <div className="text-sm font-bold text-slate-300">
                  CRR: <span className="text-emerald-400">{liveData.crr || '0.00'}</span>
                </div>
                {liveData.target && (
                  <>
                    <div className="text-sm font-bold text-slate-300">
                      Target: <span className="text-amber-400">{liveData.target}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                      Need <span className="text-white font-bold">{liveData.runsRequired}</span> runs (RRR: {liveData.rrr || '0.0'})
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recent Balls Spheres */}
            {liveData.recentBalls && liveData.recentBalls.length > 0 && (
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Recent Balls:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {liveData.recentBalls.map((b: any, idx: number) => {
                    let sphereClass = 'bg-slate-800 text-white border-slate-700';
                    let text = `${b.runs}`;

                    if (b.isWicket) {
                      sphereClass = 'bg-rose-600 text-white border-rose-500 font-bold';
                      text = 'W';
                    } else if (b.runs === 4) {
                      sphereClass = 'bg-emerald-600 text-white border-emerald-400 font-bold';
                    } else if (b.runs === 6) {
                      sphereClass = 'bg-amber-500 text-slate-950 font-black border-amber-400';
                    } else if (b.extraType && b.extraType !== 'NONE') {
                      sphereClass = 'bg-indigo-600 text-white border-indigo-400 text-[10px]';
                      text = `${b.extraType.slice(0, 2)}`;
                    }

                    return (
                      <span
                        key={idx}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center text-xs shadow-md ${sphereClass}`}
                      >
                        {text}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center text-slate-400">
            Innings not initialized yet. Waiting for toss and scorer setup.
          </div>
        )}
      </div>

      {/* Current Batters & Bowler Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Batters Box */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
            Batting
          </h3>

          {liveData.striker || liveData.nonStriker ? (
            <div className="space-y-2">
              {liveData.striker && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-white text-base">{liveData.striker.fullName}</span>
                    <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      STRIKER
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-300">Batting</span>
                </div>
              )}

              {liveData.nonStriker && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  <span className="font-bold text-slate-200 text-base">{liveData.nonStriker.fullName}</span>
                  <span className="text-xs text-slate-400">Non-Striker</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">Batter details updating...</p>
          )}
        </div>

        {/* Bowler Box */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <h3 className="font-bold text-sm text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
            Bowling
          </h3>

          {liveData.currentBowler ? (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-base">{liveData.currentBowler.fullName}</h4>
                <p className="text-xs text-slate-400">{liveData.currentBowler.bowlingStyle || 'Bowler'}</p>
              </div>
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                ACTIVE BOWLER
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">Bowler details updating...</p>
          )}
        </div>
      </div>

      {/* Embedded YouTube Live Video Player if stream URL provided */}
      {liveData.liveStreamUrl && (
        <section className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Tv className="w-5 h-5 text-emerald-400" />
            <span>Live Video Stream</span>
          </div>

          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
            {liveData.liveStreamUrl.includes('youtube.com') || liveData.liveStreamUrl.includes('youtu.be') ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${getYouTubeId(liveData.liveStreamUrl)}?autoplay=0`}
                title="Live Match Broadcast"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="text-center p-6 space-y-2">
                <p className="text-sm font-semibold text-slate-300">Live Stream URL Available:</p>
                <a
                  href={liveData.liveStreamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline font-bold text-sm"
                >
                  {liveData.liveStreamUrl}
                </a>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : '';
}
