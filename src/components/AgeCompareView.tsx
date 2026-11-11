import React, { useState } from 'react';
import {
  Users2,
  ArrowLeftRight,
  Calendar,
  Sparkles,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import {
  calculateAge,
  calculateAgeDifference,
  getWesternZodiac,
  getGenerationCohort,
} from '../utils/ageCalculator.ts';

interface AgeCompareViewProps {
  defaultBirthDateStr: string;
}

export const AgeCompareView: React.FC<AgeCompareViewProps> = ({ defaultBirthDateStr }) => {
  const [person1Name, setPerson1Name] = useState('Person 1');
  const [person1DateStr, setPerson1DateStr] = useState(defaultBirthDateStr || '1998-05-15');

  const [person2Name, setPerson2Name] = useState('Person 2');
  const [person2DateStr, setPerson2DateStr] = useState('2001-09-20');

  const parseDate = (dStr: string) => {
    if (!dStr) return new Date(2000, 0, 1);
    const [y, m, d] = dStr.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };

  const d1 = React.useMemo(() => parseDate(person1DateStr), [person1DateStr]);
  const d2 = React.useMemo(() => parseDate(person2DateStr), [person2DateStr]);

  const comparison = React.useMemo(() => calculateAgeDifference(d1, d2), [d1, d2]);

  const age1 = React.useMemo(() => calculateAge(d1), [d1]);
  const age2 = React.useMemo(() => calculateAge(d2), [d2]);

  const zodiac1 = React.useMemo(() => getWesternZodiac(d1), [d1]);
  const zodiac2 = React.useMemo(() => getWesternZodiac(d2), [d2]);

  const gen1 = React.useMemo(() => getGenerationCohort(d1), [d1]);
  const gen2 = React.useMemo(() => getGenerationCohort(d2), [d2]);

  const handleSwap = () => {
    const tempName = person1Name;
    const tempDate = person1DateStr;
    setPerson1Name(person2Name);
    setPerson1DateStr(person2DateStr);
    setPerson2Name(tempName);
    setPerson2DateStr(tempDate);
  };

  const olderPersonName = comparison.isFirstPersonOlder ? person1Name : person2Name;
  const youngerPersonName = comparison.isFirstPersonOlder ? person2Name : person1Name;

  return (
    <div className="space-y-8">
      {/* Configuration Header: Input for Both Individuals */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Compare Two Dates of Birth
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculate exact age difference, double-age moments, and celestial dynamics
            </p>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            title="Swap Persons"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Swap</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Person 1 Input */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label
                htmlFor="p1-name"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                First Person
              </label>
              <input
                id="p1-name"
                type="text"
                value={person1Name}
                onChange={(e) => setPerson1Name(e.target.value)}
                placeholder="Name"
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <input
                type="date"
                value={person1DateStr}
                onChange={(e) => setPerson1DateStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Person 2 Input */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label
                htmlFor="p2-name"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
              >
                Second Person
              </label>
              <input
                id="p2-name"
                type="text"
                value={person2Name}
                onChange={(e) => setPerson2Name(e.target.value)}
                placeholder="Name"
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <input
                type="date"
                value={person2DateStr}
                onChange={(e) => setPerson2DateStr(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Difference Spotlight Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
              Exact Age Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              {comparison.diff.years} Years, {comparison.diff.months} Months, {comparison.diff.days} Days
            </h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-amber-300 font-semibold block">
              {olderPersonName} is older by {comparison.diff.totalDays.toLocaleString()} days
            </span>
            <span className="text-xs text-slate-400">
              ({comparison.diff.totalHours.toLocaleString()} hours · {comparison.diff.totalWeeks.toLocaleString()} weeks)
            </span>
          </div>
        </div>

        {/* Double Age Mathematical Moment */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider block">
                Mathematical Double-Age Milestone
              </span>
              <p className="text-sm text-slate-200 mt-0.5">
                {comparison.hasDoubleAgePassed ? (
                  <>
                    On <span className="font-bold text-white">{comparison.doubleAgeDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>, {olderPersonName} was{' '}
                    <span className="text-amber-300 font-semibold">exactly twice as old</span> as {youngerPersonName}!
                  </>
                ) : (
                  <>
                    On <span className="font-bold text-white">{comparison.doubleAgeDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>, {olderPersonName} will be{' '}
                    <span className="text-amber-300 font-semibold">exactly twice as old</span> as {youngerPersonName}!
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side In-Depth Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Person 1 Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {person1Name}
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {d1.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                Current Age
              </span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                {age1.years}y {age1.months}m {age1.days}d
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                {age1.totalDays.toLocaleString()} total days alive
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Day Born:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{age1.dayOfWeekBorn}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Western Zodiac:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{zodiac1.symbol} {zodiac1.name} ({zodiac1.element})</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Generation:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{gen1.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Person 2 Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                {person2Name}
              </h4>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {d2.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">
                Current Age
              </span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                {age2.years}y {age2.months}m {age2.days}d
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
                {age2.totalDays.toLocaleString()} total days alive
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Day Born:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{age2.dayOfWeekBorn}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Western Zodiac:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{zodiac2.symbol} {zodiac2.name} ({zodiac2.element})</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Generation:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{gen2.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
