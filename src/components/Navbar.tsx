import React from 'react';
import {
  Calendar,
  Users2,
  PawPrint,
  Moon,
  Sun,
  BookmarkPlus,
  Share2,
} from 'lucide-react';

export type MainMode = 'calculator' | 'compare' | 'pet';

interface NavbarProps {
  mode: MainMode;
  setMode: (mode: MainMode) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  onOpenProfiles: () => void;
  onOpenShare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  setMode,
  isDark,
  setIsDark,
  onOpenProfiles,
  onOpenShare,
}) => {
  const modes: { id: MainMode; label: string; icon: React.ReactNode }[] = [
    { id: 'calculator', label: 'Age Calculator', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'compare', label: 'Compare Ages', icon: <Users2 className="w-3.5 h-3.5" /> },
    { id: 'pet', label: 'Pet Age', icon: <PawPrint className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => setMode('calculator')}
          className="flex items-center gap-2 focus:outline-none cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-xs">
            <Calendar className="w-4.5 h-4.5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Chronos
          </span>
        </button>

        {/* Clean Center Mode Switcher */}
        <nav className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {modes.map((m) => {
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {m.icon}
                <span className="hidden sm:inline">{m.label}</span>
                <span className="sm:hidden">{m.id === 'calculator' ? 'Age' : m.id === 'compare' ? 'Compare' : 'Pets'}</span>
              </button>
            );
          })}
        </nav>

        {/* Utility Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onOpenProfiles}
            title="Saved Profiles"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Profiles"
          >
            <BookmarkPlus className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenShare}
            title="Share Age Record"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
