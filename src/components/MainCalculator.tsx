import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Sparkles,
  PartyPopper,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  Wind,
  Orbit,
  Compass,
} from 'lucide-react';
import {
  calculateAge,
  calculateNextBirthday,
  getWesternZodiac,
  getChineseZodiac,
  getMoonPhase,
  getGenerationCohort,
  calculateLifeStats,
  getLifeMilestones,
  getPlanetaryAges,
} from '../utils/ageCalculator.ts';
import { fireBirthdayConfetti } from '../utils/confetti.ts';
import { SavedProfile } from '../types/index.ts';

interface MainCalculatorProps {
  birthDateStr: string;
  setBirthDateStr: (d: string) => void;
  birthTimeStr: string;
  setBirthTimeStr: (t: string) => void;
  includeTime: boolean;
  setIncludeTime: (inc: boolean) => void;
  targetDateStr: string;
  setTargetDateStr: (d: string) => void;
  isCustomTarget: boolean;
  setIsCustomTarget: (custom: boolean) => void;
  profiles: SavedProfile[];
  activeProfileId: string | null;
  onSelectProfile: (profile: SavedProfile) => void;
  onOpenNewProfileModal: () => void;
}

export const MainCalculator: React.FC<MainCalculatorProps> = ({
  birthDateStr,
  setBirthDateStr,
  birthTimeStr,
  setBirthTimeStr,
  includeTime,
  setIncludeTime,
  targetDateStr,
  setTargetDateStr,
  isCustomTarget,
  setIsCustomTarget,
  profiles,
  activeProfileId,
  onSelectProfile,
  onOpenNewProfileModal,
}) => {
  const [currentNow, setCurrentNow] = useState(new Date());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'duration' | 'milestones' | 'cosmic'>('duration');
  const [showAdvancedInputs, setShowAdvancedInputs] = useState(false);

  // Live ticking heartbeat
  useEffect(() => {
    if (isCustomTarget) return;
    const timer = setInterval(() => setCurrentNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isCustomTarget]);

  // Parse birth date
  const birthDate = React.useMemo(() => {
    if (!birthDateStr) return new Date(2000, 0, 1);
    const [y, m, d] = birthDateStr.split('-').map(Number);
    let hours = 0;
    let minutes = 0;
    if (includeTime && birthTimeStr) {
      const [h, min] = birthTimeStr.split(':').map(Number);
      hours = isNaN(h) ? 0 : h;
      minutes = isNaN(min) ? 0 : min;
    }
    return new Date(y, (m || 1) - 1, d || 1, hours, minutes, 0);
  }, [birthDateStr, birthTimeStr, includeTime]);

  // Parse target date
  const targetDate = React.useMemo(() => {
    if (!isCustomTarget || !targetDateStr) return currentNow;
    const [y, m, d] = targetDateStr.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1, 23, 59, 59);
  }, [isCustomTarget, targetDateStr, currentNow]);

  const age = React.useMemo(() => calculateAge(birthDate, targetDate), [birthDate, targetDate]);
  const nextBday = React.useMemo(() => calculateNextBirthday(birthDate, currentNow), [birthDate, currentNow]);
  const zodiac = React.useMemo(() => getWesternZodiac(birthDate), [birthDate]);
  const chineseZodiac = React.useMemo(() => getChineseZodiac(birthDate), [birthDate]);
  const moonPhase = React.useMemo(() => getMoonPhase(birthDate), [birthDate]);
  const gen = React.useMemo(() => getGenerationCohort(birthDate), [birthDate]);
  const lifeStats = React.useMemo(() => calculateLifeStats(age.totalDays, age.totalMinutes), [age.totalDays, age.totalMinutes]);
  const milestones = React.useMemo(() => getLifeMilestones(birthDate, currentNow), [birthDate, currentNow]);
  const nextMilestone = milestones.find((m) => !m.isCompleted);
  const planetaryAges = React.useMemo(() => getPlanetaryAges(age.totalDays), [age.totalDays]);

  const handleCopyStat = (label: string, value: string | number) => {
    navigator.clipboard.writeText(`${label}: ${value.toLocaleString()}`);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profiles Quick Row (Minimalist & Uncluttered) */}
      {profiles.length > 0 && (
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          <span className="text-slate-500 dark:text-slate-400">Profiles:</span>
          {profiles.map((p) => {
            const isSelected = p.id === activeProfileId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectProfile(p)}
                className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span>{p.name}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={onOpenNewProfileModal}
            className="text-amber-600 dark:text-amber-400 hover:underline font-medium ml-1 cursor-pointer"
          >
            + Add
          </button>
        </div>
      )}

      {/* Primary Clean Input Box */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <label
              htmlFor="birth-date-main"
              className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5"
            >
              When were you born?
            </label>
            <div className="relative">
              <input
                id="birth-date-main"
                type="date"
                value={birthDateStr}
                onChange={(e) => setBirthDateStr(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full text-base sm:text-lg font-semibold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-1 sm:pt-0">
            <button
              type="button"
              onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{showAdvancedInputs ? 'Fewer options' : 'More options (Time & Custom date)'}</span>
              {showAdvancedInputs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <span className="text-xs text-slate-400">
              Born on a {age.dayOfWeekBorn}
            </span>
          </div>
        </div>

        {/* Collapsible Advanced Options (Keeps UI quiet until requested!) */}
        {showAdvancedInputs && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs animate-fade-in">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Birth Time (Optional)</span>
                <button
                  type="button"
                  onClick={() => setIncludeTime(!includeTime)}
                  className="text-amber-600 dark:text-amber-400 hover:underline"
                >
                  {includeTime ? 'Disable' : 'Enable'}
                </button>
              </div>
              {includeTime ? (
                <input
                  type="time"
                  value={birthTimeStr}
                  onChange={(e) => setBirthTimeStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              ) : (
                <p className="text-slate-500 text-[11px]">Enable to count exact hours and minutes of your birth.</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Target Date</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomTarget(!isCustomTarget);
                    if (isCustomTarget) setTargetDateStr(new Date().toISOString().split('T')[0]);
                  }}
                  className="text-amber-600 dark:text-amber-400 hover:underline"
                >
                  {isCustomTarget ? 'Reset to Today' : 'Change Target Date'}
                </button>
              </div>
              {isCustomTarget ? (
                <input
                  type="date"
                  value={targetDateStr}
                  onChange={(e) => setTargetDateStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              ) : (
                <p className="text-slate-500 text-[11px]">Currently calculating age as of today with live ticking.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Elegant, Focused Age Hero Card */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 text-center border border-slate-800 shadow-lg relative overflow-hidden">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-2">
          Your Current Age
        </span>

        {/* Large, Beautiful Typographic Age Display */}
        <div className="my-2 flex items-baseline justify-center gap-2 sm:gap-3 flex-wrap">
          <div className="inline-flex items-baseline gap-1">
            <span className="text-4xl sm:text-6xl font-extrabold font-mono tabular-nums text-white">
              {age.years}
            </span>
            <span className="text-sm sm:text-base font-medium text-slate-400">years</span>
          </div>
          <span className="text-slate-600 text-2xl font-light">·</span>
          <div className="inline-flex items-baseline gap-1">
            <span className="text-4xl sm:text-6xl font-extrabold font-mono tabular-nums text-white">
              {age.months}
            </span>
            <span className="text-sm sm:text-base font-medium text-slate-400">months</span>
          </div>
          <span className="text-slate-600 text-2xl font-light">·</span>
          <div className="inline-flex items-baseline gap-1">
            <span className="text-4xl sm:text-6xl font-extrabold font-mono tabular-nums text-white">
              {age.days}
            </span>
            <span className="text-sm sm:text-base font-medium text-slate-400">days</span>
          </div>
        </div>

        {/* Live Ticking Time Counter */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-amber-300 font-mono tabular-nums">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {String(age.hours).padStart(2, '0')}h {String(age.minutes).padStart(2, '0')}m {String(age.seconds).padStart(2, '0')}s
          </span>
          <span className="text-slate-400 font-sans ml-1">({age.decimalYears.toFixed(6)} years)</span>
        </div>

        {/* Next Birthday Quiet Line with Cheer */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <PartyPopper className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Next birthday in <strong className="text-white font-mono">{nextBday.daysRemaining} days</strong> (Turning {nextBday.turningAge} on {nextBday.dayOfWeek}, {nextBday.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})
            </span>
          </div>

          <button
            type="button"
            onClick={fireBirthdayConfetti}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cheer 🎂</span>
          </button>
        </div>
      </div>

      {/* Clean 3-Tab Explorer (Replaces 20 noisy cards with structured on-demand tabs) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-5">
        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('duration')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
              activeSubTab === 'duration'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Total Duration
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('milestones')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
              activeSubTab === 'milestones'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Life & Body Stats
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('cosmic')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center ${
              activeSubTab === 'cosmic'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Zodiac & Cosmos
          </button>
        </div>

        {/* Tab 1: Total Duration Breakdown */}
        {activeSubTab === 'duration' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
            {[
              { label: 'Total Days', value: age.totalDays },
              { label: 'Total Weeks', value: age.totalWeeks },
              { label: 'Total Months', value: Math.floor(age.totalMonths) },
              { label: 'Total Hours', value: age.totalHours },
              { label: 'Total Minutes', value: age.totalMinutes },
              { label: 'Total Seconds', value: age.totalSeconds },
            ].map((stat) => (
              <button
                key={stat.label}
                type="button"
                onClick={() => handleCopyStat(stat.label, stat.value)}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-left hover:border-slate-300 dark:hover:border-slate-700 transition-colors group cursor-pointer"
                title="Click to copy"
              >
                <div className="flex items-center justify-between text-slate-400 mb-0.5">
                  <span className="text-[11px] font-medium">{stat.label}</span>
                  {copiedKey === stat.label ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
                <span className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {stat.value.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Tab 2: Milestones & Body Stats */}
        {activeSubTab === 'milestones' && (
          <div className="space-y-4 animate-fade-in text-xs">
            {nextMilestone && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                    Next Life Milestone
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {nextMilestone.title}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                    {nextMilestone.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
                    in {nextMilestone.daysDiff.toLocaleString()}d
                  </span>
                  <span className="text-[10px] text-slate-400 block">{nextMilestone.percentProgress}% complete</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block">Heartbeats (~72 bpm)</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {lifeStats.heartbeats.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block">Breaths (~15/min)</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {lifeStats.breaths.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block">Hours Slept (~8h/d)</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {lifeStats.hoursSlept.toLocaleString()}h
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block">Solar Orbit Traveled</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                  {(lifeStats.earthOrbitKm / 1000000).toFixed(0)}M km
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Zodiac & Cosmic Insights */}
        {activeSubTab === 'cosmic' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block">Western Zodiac</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {zodiac.symbol} {zodiac.name}
                </span>
                <span className="text-[10px] text-slate-500">{zodiac.element} · {zodiac.dateRange}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block">Chinese Zodiac</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                  Year of {chineseZodiac.animal}
                </span>
                <span className="text-[10px] text-slate-500">{chineseZodiac.element} Element</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block">Birth Moon Phase</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {moonPhase.symbol} {moonPhase.phaseName}
                </span>
                <span className="text-[10px] text-slate-500">{moonPhase.illumination}% lit</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block">Generation</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block truncate">
                  {gen.name}
                </span>
                <span className="text-[10px] text-slate-500">{gen.years}</span>
              </div>
            </div>

            {/* Quick Planetary Ages Highlight */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Orbit className="w-4 h-4 text-amber-500" />
                <span>On Mars you are <strong className="text-slate-900 dark:text-white font-mono">{planetaryAges.find(p => p.planet === 'Mars')?.ageOnPlanet}</strong>, on Jupiter you are <strong className="text-slate-900 dark:text-white font-mono">{planetaryAges.find(p => p.planet === 'Jupiter')?.ageOnPlanet}</strong> years old!</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
