import React, { useState, useEffect } from 'react';
import { Navbar, MainMode } from './components/Navbar.tsx';
import { MainCalculator } from './components/MainCalculator.tsx';
import { AgeCompareView } from './components/AgeCompareView.tsx';
import { PetAgeView } from './components/PetAgeView.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { ShareModal } from './components/ShareModal.tsx';
import { SavedProfile } from './types/index.ts';

const DEFAULT_PROFILES: SavedProfile[] = [
  {
    id: 'profile-me',
    name: 'Me',
    birthDate: '1998-05-15',
    birthTime: '08:30',
    relation: 'self',
    color: '#F59E0B',
  },
  {
    id: 'profile-partner',
    name: 'Emma',
    birthDate: '2000-11-20',
    birthTime: '14:15',
    relation: 'partner',
    color: '#EC4899',
  },
];

export default function App() {
  const [mode, setMode] = useState<MainMode>('calculator');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('chronos_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [profiles, setProfiles] = useState<SavedProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chronos_profiles');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string | null>('profile-me');

  const [birthDateStr, setBirthDateStr] = useState<string>('1998-05-15');
  const [birthTimeStr, setBirthTimeStr] = useState<string>('08:30');
  const [includeTime, setIncludeTime] = useState<boolean>(false);

  const [targetDateStr, setTargetDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isCustomTarget, setIsCustomTarget] = useState<boolean>(false);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Sync dark theme class on <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('chronos_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('chronos_theme', 'light');
    }
  }, [isDark]);

  const handleSaveProfiles = (updatedProfiles: SavedProfile[]) => {
    setProfiles(updatedProfiles);
    localStorage.setItem('chronos_profiles', JSON.stringify(updatedProfiles));
  };

  const handleSelectProfile = (p: SavedProfile) => {
    setActiveProfileId(p.id);
    setBirthDateStr(p.birthDate);
    if (p.birthTime) {
      setBirthTimeStr(p.birthTime);
      setIncludeTime(true);
    } else {
      setIncludeTime(false);
    }
  };

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Clean Navbar */}
      <Navbar
        mode={mode}
        setMode={setMode}
        isDark={isDark}
        setIsDark={setIsDark}
        onOpenProfiles={() => setIsProfileModalOpen(true)}
        onOpenShare={() => setIsShareModalOpen(true)}
      />

      {/* Main Content Area (Spacious, Calm & Focused) */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {mode === 'calculator' && (
          <MainCalculator
            birthDateStr={birthDateStr}
            setBirthDateStr={setBirthDateStr}
            birthTimeStr={birthTimeStr}
            setBirthTimeStr={setBirthTimeStr}
            includeTime={includeTime}
            setIncludeTime={setIncludeTime}
            targetDateStr={targetDateStr}
            setTargetDateStr={setTargetDateStr}
            isCustomTarget={isCustomTarget}
            setIsCustomTarget={setIsCustomTarget}
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSelectProfile={handleSelectProfile}
            onOpenNewProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {mode === 'compare' && (
          <AgeCompareView defaultBirthDateStr={birthDateStr} />
        )}

        {mode === 'pet' && (
          <PetAgeView />
        )}
      </main>

      {/* Discreet, Quiet Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Chronos · Precision Age Calculator</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Profiles
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Share Summary
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        onSaveProfiles={handleSaveProfiles}
        onSelectProfile={handleSelectProfile}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        birthDateStr={birthDateStr}
        name={activeProfile ? activeProfile.name : 'My'}
      />
    </div>
  );
}
