'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Plus, Calendar, MapPin, Tv, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateMatchPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [teamAId, setTeamAId] = useState('');
  const [teamBId, setTeamBId] = useState('');
  const [venue, setVenue] = useState('Village Main Oval');
  const [scheduledAt, setScheduledAt] = useState(new Date().toISOString().slice(0, 16));
  const [totalOvers, setTotalOvers] = useState(20);
  const [liveStreamUrl, setLiveStreamUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const { data: teams } = useQuery({
    queryKey: ['teams-select'],
    queryFn: async () => {
      const res = await api.get('/teams');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/matches', payload);
      return res.data;
    },
    onSuccess: (data) => {
      router.push(`/admin/matches/${data.id}/scoring`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create match fixture.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (teamAId === teamBId) {
      setError('Team A and Team B cannot be the same team.');
      return;
    }

    createMutation.mutate({
      title: title || 'Village XI Match Fixture',
      teamAId,
      teamBId,
      venue,
      scheduledAt: new Date(scheduledAt).toISOString(),
      totalOvers: Number(totalOvers),
      liveStreamUrl,
      description,
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-medium">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Console</span>
      </Link>

      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white">Schedule New Cricket Match</h1>
          <p className="text-xs text-slate-400">Fill match details to setup fixture and enable live scoring</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Match Title / Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Village XI vs Town Royals — League Opener"
              required
              className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300">Team A</label>
              <select
                value={teamAId}
                onChange={(e) => setTeamAId(e.target.value)}
                required
                className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select Team A</option>
                {teams?.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.shortName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Team B</label>
              <select
                value={teamBId}
                onChange={(e) => setTeamBId(e.target.value)}
                required
                className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="">Select Team B</option>
                {teams?.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.shortName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300">Venue / Ground</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
                className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Total Overs Limit</label>
              <input
                type="number"
                value={totalOvers}
                onChange={(e) => setTotalOvers(Number(e.target.value))}
                min={1}
                max={50}
                required
                className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Scheduled Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
              className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">YouTube / Stream Link (Optional)</label>
            <input
              type="url"
              value={liveStreamUrl}
              onChange={(e) => setLiveStreamUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-sm hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 mt-4"
          >
            {createMutation.isPending ? 'Scheduling Match...' : 'Create Fixture & Open Scorer Console'}
          </button>
        </form>
      </div>
    </div>
  );
}
