'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Trophy, Shield, User, LogOut, Flame } from 'lucide-react';

export function Navbar() {
  const { user, logout, hasRole } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800/80 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Trophy className="w-5 h-5 font-bold" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
              VILLAGE XI
            </span>
            <span className="block text-[10px] font-semibold tracking-widest text-emerald-400 uppercase -mt-1">
              Live Cricket Platform
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/matches" className="text-slate-300 hover:text-emerald-400 transition-colors">
            Fixtures & Results
          </Link>
          <Link href="/teams" className="text-slate-300 hover:text-emerald-400 transition-colors">
            Teams
          </Link>
          <Link href="/players" className="text-slate-300 hover:text-emerald-400 transition-colors">
            Players
          </Link>

          {(hasRole('ADMIN') || hasRole('SCORER')) && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-semibold"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Console</span>
            </Link>
          )}
        </nav>

        {/* User Auth Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-medium hidden sm:inline">{user.name || user.phone}</span>
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-bold text-sm hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-md shadow-emerald-500/20"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
