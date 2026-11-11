import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Wind,
  Eye,
  Moon,
  Globe2,
  Utensils,
  CheckCircle2,
  Clock,
  Calendar,
  PartyPopper,
} from 'lucide-react';
import { calculateLifeStats, getLifeMilestones, calculateAge } from '../utils/ageCalculator.ts';
import { fireBirthdayConfetti } from '../utils/confetti.ts';

interface MilestonesViewProps {
  birthDateStr: string;
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({ birthDateStr }) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const birthDate = React.useMemo(() => {
    if (!birthDateStr) return new Date(2000, 0, 1);
    const [y, m, d] = birthDateStr.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }, [birthDateStr]);

  const now = new Date();
  const age = React.useMemo(() => calculateAge(birthDate, now), [birthDate]);
  const stats = React.useMemo(
    () => calculateLifeStats(age.totalDays, age.totalMinutes),
    [age.totalDays, age.totalMinutes]
  );
  const milestones = React.useMemo(() => getLifeMilestones(birthDate, now), [birthDate]);

  // Find next upcoming milestone
  const nextMilestone = milestones.find((m) => !m.isCompleted);

  const filteredMilestones = milestones.filter((m) => {
    if (filter === 'upcoming') return !m.isCompleted;
    if (filter === 'completed') return m.isCompleted;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Hero Next Milestone Spotlight */}
      {nextMilestone && (
        <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Next Major Life Milestone
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {nextMilestone.title}
              </h2>
              <p className="text-sm text-slate-300">
                Arriving on{' '}
                <span className="font-semibold text-white">
                  {nextMilestone.date.toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </p>

              <div className="pt-2 max-w-md">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>Milestone Progress</span>
                  <span className="font-mono tabular-nums text-amber-300 font-semibold">
                    {nextMilestone.percentProgress}%
                  </span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                    style={{ width: `${nextMilestone.percentProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/10 min-w-[140px]">
                <span className="block text-3xl font-extrabold font-mono tabular-nums text-amber-300">
                  {nextMilestone.daysDiff.toLocaleString()}
                </span>
                <span className="text-xs text-slate-300 uppercase tracking-wider font-medium">
                  Days Remaining
                </span>
              </div>
              <button
                type="button"
                onClick={fireBirthdayConfetti}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Cheer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Biological & Cosmic Life Stats */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Biological & Cosmic Life Statistics
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Estimated vital statistics calculated from your {age.totalDays.toLocaleString()} days alive
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Heartbeats */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 shrink-0">
              <Heart className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Estimated Heartbeats
              </span>
              <span className="block text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                {stats.heartbeats.toLocaleString()}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Pumping non-stop at ~72 bpm since your first breath
              </p>
            </div>
          </div>

          {/* Breaths */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500 shrink-0">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Estimated Breaths Taken
              </span>
              <span className="block text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                {stats.breaths.toLocaleString()}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Average respiration rate of 15 breaths per minute
              </p>
            </div>
          </div>

          {/* Eye Blinks */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Times Blinked
              </span>
              <span className="block text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                {stats.blinks.toLocaleString()}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Protecting and hydrating your corneas ~17 times/min awake
              </p>
            </div>
          </div>

          {/* Sleep */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500 shrink-0">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Hours Spent Sleeping
              </span>
              <span className="block text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                {stats.hoursSlept.toLocaleString()} hrs
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Equivalent to ~{(stats.hoursSlept / 24 / 365.25).toFixed(1)} full years of peaceful rest
              </p>
            </div>
          </div>

          {/* Solar Orbit Flight */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Solar Orbit Traveled
              </span>
              <span className="block text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                {(stats.earthOrbitKm / 1000000).toLocaleString(undefined, { maximumFractionDigits: 1 })}M km
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Distance your body has hurtled through space around the Sun
              </p>
            </div>
          </div>

          {/* Meals */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Estimated Meals Enjoyed
              </span>
              <span className="block text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-0.5">
                {stats.mealsEaten.toLocaleString()} meals
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Fueling your mind, body, and adventures
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Life Milestones Timeline */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Significant Life Milestones
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chronological, mathematical, and jubilee celebrations across your lifespan
            </p>
          </div>

          {/* Interactive Filter Segmented Control (allowed by frontend-design guidelines) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({milestones.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === 'upcoming'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Upcoming ({milestones.filter((m) => !m.isCompleted).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                filter === 'completed'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Achieved ({milestones.filter((m) => m.isCompleted).length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMilestones.map((m) => {
            return (
              <div
                key={m.id}
                className={`rounded-2xl border p-5 transition-all shadow-xs flex flex-col justify-between ${
                  m.isCompleted
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : 'bg-slate-50/70 dark:bg-slate-900/60 border-amber-500/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {m.category === 'cultural' ? 'Cultural Milestone' : 'Time Achievement'}
                    </span>
                    {m.isCompleted ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Achieved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        In {m.daysDiff.toLocaleString()} days
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {m.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {m.date.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Completion</span>
                      <span className="font-mono tabular-nums font-semibold">
                        {m.percentProgress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          m.isCompleted
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-amber-500 to-amber-400'
                        }`}
                        style={{ width: `${m.percentProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    {m.isCompleted
                      ? `${Math.abs(m.daysDiff).toLocaleString()} days ago`
                      : `${m.daysDiff.toLocaleString()} days to go`}
                  </span>
                  {m.isCompleted && (
                    <button
                      type="button"
                      onClick={fireBirthdayConfetti}
                      className="text-amber-600 dark:text-amber-400 hover:underline font-medium cursor-pointer"
                    >
                      Celebrate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
