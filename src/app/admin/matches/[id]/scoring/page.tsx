'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ScoreButton } from '@/components/ui/ScoreButton';
import { LiveIndicator } from '@/components/ui/LiveIndicator';
import { Activity, RotateCcw, AlertTriangle, CheckCircle2, ChevronRight, UserPlus, ShieldAlert, ArrowLeftRight } from 'lucide-react';

export default function ScorerConsolePage() {
  const params = useParams();
  const matchId = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedExtra, setSelectedExtra] = useState<'NONE' | 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE'>('NONE');
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showOverModal, setShowOverModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);

  const [dismissalType, setDismissalType] = useState('BOWLED');
  const [nextBowlerId, setNextBowlerId] = useState('');

  // Start match form state
  const [tossWinnerId, setTossWinnerId] = useState('');
  const [tossDecision, setTossDecision] = useState<'BAT' | 'BOWL'>('BAT');
  const [strikerId, setStrikerId] = useState('');
  const [nonStrikerId, setNonStrikerId] = useState('');
  const [openingBowlerId, setOpeningBowlerId] = useState('');

  // Fetch match details
  const { data: match, isLoading } = useQuery({
    queryKey: ['admin-match-scoring', matchId],
    queryFn: async () => {
      const res = await api.get(`/matches/${matchId}`);
      return res.data;
    },
    refetchInterval: 3000,
  });

  // Ball Entry Mutation
  const ballMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post(`/matches/${matchId}/balls`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-match-scoring', matchId] });
      setSelectedExtra('NONE');
      setShowWicketModal(false);
    },
  });

  // Undo Ball Mutation
  const undoMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/matches/${matchId}/undo`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-match-scoring', matchId] });
    },
  });

  // Start Match Mutation
  const startMatchMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post(`/matches/${matchId}/start`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-match-scoring', matchId] });
      setShowStartModal(false);
    },
  });

  // End Over Mutation
  const endOverMutation = useMutation({
    mutationFn: async (bowlerId: string) => {
      const res = await api.post(`/matches/${matchId}/end-over`, { nextBowlerId: bowlerId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-match-scoring', matchId] });
      setShowOverModal(false);
    },
  });

  const handleRunTap = (runs: number) => {
    ballMutation.mutate({
      runsBat: runs,
      extraType: selectedExtra,
      extraRuns: 0,
      isWicket: false,
    });
  };

  const handleWicketSubmit = () => {
    ballMutation.mutate({
      runsBat: 0,
      extraType: selectedExtra,
      isWicket: true,
      dismissalType,
    });
  };

  if (isLoading || !match) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading Scorer Console...
      </div>
    );
  }

  const isLive = match.status === 'LIVE';
  const currentInnings = match.innings && match.innings.length > 0 ? match.innings[match.innings.length - 1] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-4 pb-24">
      {/* Header Bar */}
      <div className="flex items-center justify-between glass-card p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white">{match.title}</h1>
            <span className="text-xs text-slate-400">{match.venue}</span>
          </div>
        </div>

        {isLive ? <LiveIndicator /> : <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-300">{match.status}</span>}
      </div>

      {/* If match is not started yet, show Start Match Setup Button */}
      {!isLive && match.status !== 'COMPLETED' && (
        <div className="glass-card p-8 rounded-3xl text-center space-y-4 border border-amber-500/30 bg-amber-500/5">
          <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Match Not Started Yet</h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            Please enter Toss results and select opening batters and bowler to initialize live ball scoring.
          </p>
          <button
            onClick={() => setShowStartModal(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-sm hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg"
          >
            Start Match & Record Toss
          </button>
        </div>
      )}

      {/* Main Live Score Display Box */}
      {currentInnings && (
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-4 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Batting: {currentInnings.battingTeam?.name || 'Innings ' + currentInnings.inningsNumber}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white">
                  {currentInnings.totalRuns}/{currentInnings.totalWickets}
                </span>
                <span className="text-base font-bold text-slate-400">
                  ({currentInnings.totalOvers} / {match.totalOvers} ov)
                </span>
              </div>
            </div>

            <button
              onClick={() => undoMutation.mutate()}
              disabled={undoMutation.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{undoMutation.isPending ? 'Reverting...' : 'Undo Last Ball'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Touch-Optimized 1-Tap Scoring Pad */}
      {isLive && (
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Scoring Controls</span>
            {selectedExtra !== 'NONE' && (
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Extra Mode: {selectedExtra}
              </span>
            )}
          </div>

          {/* Runs Pad Grid */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            <ScoreButton label="0" onClick={() => handleRunTap(0)} variant="run" disabled={ballMutation.isPending} />
            <ScoreButton label="1" onClick={() => handleRunTap(1)} variant="run" disabled={ballMutation.isPending} />
            <ScoreButton label="2" onClick={() => handleRunTap(2)} variant="run" disabled={ballMutation.isPending} />
            <ScoreButton label="3" onClick={() => handleRunTap(3)} variant="run" disabled={ballMutation.isPending} />
          </div>

          <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
            <ScoreButton label="4" onClick={() => handleRunTap(4)} variant="boundary" disabled={ballMutation.isPending} />
            <ScoreButton label="6" onClick={() => handleRunTap(6)} variant="boundary" disabled={ballMutation.isPending} />
            <ScoreButton
              label="WIDE"
              onClick={() => setSelectedExtra(selectedExtra === 'WIDE' ? 'NONE' : 'WIDE')}
              variant="extra"
            />
            <ScoreButton
              label="N/B"
              onClick={() => setSelectedExtra(selectedExtra === 'NO_BALL' ? 'NONE' : 'NO_BALL')}
              variant="extra"
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            <ScoreButton
              label="BYE"
              onClick={() => setSelectedExtra(selectedExtra === 'BYE' ? 'NONE' : 'BYE')}
              variant="extra"
            />
            <ScoreButton
              label="L/B"
              onClick={() => setSelectedExtra(selectedExtra === 'LEG_BYE' ? 'NONE' : 'LEG_BYE')}
              variant="extra"
            />
            <ScoreButton label="WICKET" onClick={() => setShowWicketModal(true)} variant="wicket" disabled={ballMutation.isPending} />
          </div>

          {/* Action Row */}
          <div className="pt-2 grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowOverModal(true)}
              className="py-3 px-4 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs hover:bg-slate-700 transition-colors"
            >
              End Over & Change Bowler
            </button>
            <button
              onClick={() => api.post(`/matches/${matchId}/end-innings`).then(() => queryClient.invalidateQueries({ queryKey: ['admin-match-scoring', matchId] }))}
              className="py-3 px-4 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold text-xs hover:bg-rose-500/20 transition-colors"
            >
              End Innings
            </button>
          </div>
        </div>
      )}

      {/* Start Match Modal */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-3xl max-w-lg w-full space-y-4 border border-slate-800">
            <h3 className="text-lg font-extrabold text-white">Start Match Setup</h3>

            <div className="space-y-3 text-left">
              <div>
                <label className="text-xs font-semibold text-slate-300">Toss Winner Team</label>
                <select
                  value={tossWinnerId}
                  onChange={(e) => setTossWinnerId(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                >
                  <option value="">Select Toss Winner</option>
                  <option value={match.teamA.id}>{match.teamA.name}</option>
                  <option value={match.teamB.id}>{match.teamB.name}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Toss Decision</label>
                <select
                  value={tossDecision}
                  onChange={(e) => setTossDecision(e.target.value as 'BAT' | 'BOWL')}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                >
                  <option value="BAT">Elects to BAT</option>
                  <option value="BOWL">Elects to BOWL</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Striker (Opening Batter)</label>
                <select
                  value={strikerId}
                  onChange={(e) => setStrikerId(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                >
                  <option value="">Select Striker</option>
                  {match.teamA.players.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.fullName} ({match.teamA.shortName})</option>
                  ))}
                  {match.teamB.players.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.fullName} ({match.teamB.shortName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Non-Striker</label>
                <select
                  value={nonStrikerId}
                  onChange={(e) => setNonStrikerId(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                >
                  <option value="">Select Non-Striker</option>
                  {match.teamA.players.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.fullName} ({match.teamA.shortName})</option>
                  ))}
                  {match.teamB.players.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.fullName} ({match.teamB.shortName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Opening Bowler</label>
                <select
                  value={openingBowlerId}
                  onChange={(e) => setOpeningBowlerId(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
                >
                  <option value="">Select Opening Bowler</option>
                  {match.teamA.players.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.fullName} ({match.teamA.shortName})</option>
                  ))}
                  {match.teamB.players.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.fullName} ({match.teamB.shortName})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowStartModal(false)}
                className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  startMatchMutation.mutate({
                    tossWinnerId,
                    tossDecision,
                    strikerId,
                    nonStrikerId,
                    openingBowlerId,
                  })
                }
                disabled={!tossWinnerId || !strikerId || !nonStrikerId || !openingBowlerId}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-extrabold text-sm disabled:opacity-50"
              >
                Start Live Match
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wicket Modal */}
      {showWicketModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 rounded-3xl max-w-md w-full space-y-4 border border-rose-500/30">
            <h3 className="text-lg font-extrabold text-rose-400">Record Wicket</h3>

            <div>
              <label className="text-xs font-semibold text-slate-300">Dismissal Type</label>
              <select
                value={dismissalType}
                onChange={(e) => setDismissalType(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
              >
                <option value="BOWLED">Bowled</option>
                <option value="CAUGHT">Caught</option>
                <option value="LBW">LBW</option>
                <option value="RUN_OUT">Run Out</option>
                <option value="STUMPED">Stumped</option>
                <option value="HIT_WICKET">Hit Wicket</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowWicketModal(false)}
                className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleWicketSubmit}
                className="w-full py-3 rounded-xl bg-rose-600 text-white font-extrabold text-sm hover:bg-rose-500"
              >
                Confirm Wicket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
