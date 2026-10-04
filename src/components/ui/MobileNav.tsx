'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Users, Shield, User } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function MobileNav() {
  const pathname = usePathname();
  const { user, hasRole } = useAuth();

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/matches', label: 'Matches', icon: Calendar },
    { href: '/teams', label: 'Teams', icon: Users },
  ];

  if (hasRole('ADMIN') || hasRole('SCORER')) {
    links.push({ href: '/admin', label: 'Admin', icon: Shield });
  } else {
    links.push({ href: user ? '/profile' : '/login', label: user ? 'Profile' : 'Login', icon: User });
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl py-2 px-4">
      <div className="flex items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
                isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
