'use client';

import React from 'react';

interface ScoreButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'run' | 'boundary' | 'extra' | 'wicket' | 'undo' | 'neutral';
  disabled?: boolean;
}

export function ScoreButton({ label, onClick, variant = 'run', disabled = false }: ScoreButtonProps) {
  let styleClasses = 'bg-slate-800/80 text-white border-slate-700 hover:bg-slate-700';

  if (variant === 'boundary') {
    styleClasses = 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-emerald-500 hover:from-emerald-500 hover:to-emerald-600 shadow-lg shadow-emerald-600/20';
  } else if (variant === 'extra') {
    styleClasses = 'bg-slate-800 text-amber-400 border-amber-500/30 hover:bg-slate-700 hover:border-amber-400';
  } else if (variant === 'wicket') {
    styleClasses = 'bg-gradient-to-br from-rose-600 to-rose-700 text-white border-rose-500 hover:from-rose-500 hover:to-rose-600 shadow-lg shadow-rose-600/20';
  } else if (variant === 'undo') {
    styleClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/40 hover:bg-amber-500/20';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-16 sm:h-20 w-full rounded-2xl border font-extrabold text-xl sm:text-2xl flex items-center justify-center transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none ${styleClasses}`}
    >
      {label}
    </button>
  );
}
