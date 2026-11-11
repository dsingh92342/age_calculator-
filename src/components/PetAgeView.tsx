import React, { useState } from 'react';
import {
  PawPrint,
  Dog,
  Cat,
  Sparkles,
  HeartHandshake,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { calculatePetAge } from '../utils/ageCalculator.ts';

export const PetAgeView: React.FC = () => {
  const [species, setSpecies] = useState<'dog' | 'cat' | 'rabbit' | 'bird' | 'horse'>('dog');
  const [dogSize, setDogSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [calendarYears, setCalendarYears] = useState<number>(3);
  const [calendarMonths, setCalendarMonths] = useState<number>(6);
  const [petName, setPetName] = useState<string>('Buddy');

  const totalAgeYears = calendarYears + calendarMonths / 12;
  const result = calculatePetAge(species, totalAgeYears, dogSize);

  const speciesOptions = [
    { id: 'dog' as const, label: 'Dog', icon: '🐕' },
    { id: 'cat' as const, label: 'Cat', icon: '🐈' },
    { id: 'rabbit' as const, label: 'Rabbit', icon: '🐇' },
    { id: 'bird' as const, label: 'Bird', icon: '🦜' },
    { id: 'horse' as const, label: 'Horse', icon: '🐎' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
        <div className="max-w-2xl mb-6">
          <span className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
            Veterinary Science Calculator
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
            Companion Pet Age & Life Stage
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Replaces the outdated "7 human years per dog year" myth with modern nonlinear epigenetic and veterinary formulas.
          </p>
        </div>

        {/* Species Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-6">
          {speciesOptions.map((opt) => {
            const isSelected = species === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSpecies(opt.id)}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className="text-xs font-semibold">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Pet Name & Age Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-4">
            <label
              htmlFor="pet-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Pet Name
            </label>
            <input
              id="pet-name"
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="pet-years"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Calendar Years
            </label>
            <input
              id="pet-years"
              type="number"
              min="0"
              max="40"
              value={calendarYears}
              onChange={(e) => setCalendarYears(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="pet-months"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
            >
              Months
            </label>
            <input
              id="pet-months"
              type="number"
              min="0"
              max="11"
              value={calendarMonths}
              onChange={(e) => setCalendarMonths(Math.min(11, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {species === 'dog' && (
            <div className="sm:col-span-12 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Dog Breed Weight Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'small' as const, label: 'Small (< 20 lbs)', sub: 'e.g. Chihuahua, Pug, Yorkie' },
                  { id: 'medium' as const, label: 'Medium (20 – 50 lbs)', sub: 'e.g. Beagle, Border Collie' },
                  { id: 'large' as const, label: 'Large (> 50 lbs)', sub: 'e.g. Labrador, German Shepherd' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setDogSize(s.id)}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      dogSize === s.id
                        ? 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white font-semibold'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="block text-xs font-bold">{s.label}</span>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {s.sub}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Result Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
              Human Equivalent Age
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-0.5">
              {petName} is ~{result.humanAge} Human Years Old
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Based on {calendarYears} years and {calendarMonths} months of actual calendar life
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-sm tracking-wide self-start sm:self-auto">
            Stage: {result.lifeStage}
          </div>
        </div>

        {/* Veterinary Care Insights */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
            <HeartHandshake className="w-4.5 h-4.5" />
            <span>Veterinary Life Stage Guidance</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {result.careTip}
          </p>
        </div>
      </div>
    </div>
  );
};
