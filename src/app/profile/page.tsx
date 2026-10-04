'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { User, Shield, Phone, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-400">Please log in to view profile details.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-2xl text-emerald-400">
            {user.name ? user.name.slice(0, 2).toUpperCase() : 'VX'}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">{user.name || 'Village XI User'}</h1>
            <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Phone className="w-3 h-3 text-slate-500" />
              {user.phone}
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Roles</span>
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <span
                key={role}
                className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={logout}
            className="w-full py-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold text-sm hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
