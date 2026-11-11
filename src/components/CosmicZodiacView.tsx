import React from 'react';
import {
  Compass,
  Sparkles,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Orbit,
  Star,
  Info,
} from 'lucide-react';
import {
  calculateAge,
  getWesternZodiac,
  getChineseZodiac,
  getMoonPhase,
  getGenerationCohort,
  getPlanetaryAges,
} from '../utils/ageCalculator.ts';

interface CosmicZodiacViewProps {
  birthDateStr: string;
}

export const CosmicZodiacView: React.FC<CosmicZodiacViewProps> = ({ birthDateStr }) => {
  const birthDate = React.useMemo(() => {
    if (!birthDateStr) return new Date(2000, 0, 1);
    const [y, m, d] = birthDateStr.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }, [birthDateStr]);

  const age = React.useMemo(() => calculateAge(birthDate), [birthDate]);
  const zodiac = React.useMemo(() => getWesternZodiac(birthDate), [birthDate]);
  const chineseZodiac = React.useMemo(() => getChineseZodiac(birthDate), [birthDate]);
  const moonPhase = React.useMemo(() => getMoonPhase(birthDate), [birthDate]);
  const generation = React.useMemo(() => getGenerationCohort(birthDate), [birthDate]);
  const planetaryAges = React.useMemo(() => getPlanetaryAges(age.totalDays), [age.totalDays]);

  const getElementIcon = (el: string) => {
    switch (el) {
      case 'Fire':
        return <Flame className="w-4 h-4 text-rose-500" />;
      case 'Water':
        return <Droplets className="w-4 h-4 text-cyan-500" />;
      case 'Air':
        return <Wind className="w-4 h-4 text-amber-500" />;
      case 'Earth':
      default:
        return <Mountain className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* 2-Column Split: Western Zodiac & Chinese Zodiac / Moon Phase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Western Zodiac Deep Dive */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
                  Western Astrology
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                  <span>{zodiac.symbol}</span>
                  <span>{zodiac.name}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {zodiac.dateRange} · {zodiac.quality} {zodiac.element}
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {getElementIcon(zodiac.element)}
                <span>{zodiac.element} Sign</span>
              </div>
            </div>

            {/* Core Zodiac Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                  Ruling Planet
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block">
                  {zodiac.ruler}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                  Lucky Number
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 block font-mono">
                  {zodiac.luckyNumber}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                  Birth Flower
                </span>
                <span className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5 block truncate">
                  {zodiac.flower}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                  Birthstone
                </span>
                <span className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5 block truncate">
                  {zodiac.stone}
                </span>
              </div>
            </div>

            {/* Traits */}
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Archetypal Traits
              </span>
              <div className="flex flex-wrap gap-1.5">
                {zodiac.traits.map((trait) => (
                  <span
                    key={trait}
                    className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Harmonious with fellow {zodiac.element} and complementary signs</span>
            <div className="flex items-center gap-1.5">
              <span>Lucky Color:</span>
              <span
                className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 inline-block"
                style={{ backgroundColor: zodiac.luckyColor }}
              />
            </div>
          </div>
        </div>

        {/* Chinese Zodiac & Historical Moon Phase */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          {/* Chinese Lunar Zodiac */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex-1">
            <span className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
              Eastern Lunar Zodiac
            </span>
            <div className="flex items-center justify-between mt-1 mb-3">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Year of the {chineseZodiac.animal}
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400">
                {chineseZodiac.element} Element
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              {chineseZodiac.chineseYear}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white shrink-0">
                  Key Strengths:
                </span>
                <span>{chineseZodiac.traits.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-white shrink-0">
                  Compatible Signs:
                </span>
                <span>{chineseZodiac.compatibleAnimals.join(' · ')}</span>
              </div>
            </div>
          </div>

          {/* Historical Moon Phase at Birth */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
                  Birth Moon Phase
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                  <span>{moonPhase.symbol}</span>
                  <span>{moonPhase.phaseName}</span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                  {moonPhase.illumination}%
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">
                  Illuminated
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {moonPhase.description}
            </p>
            <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
              Moon Age: {moonPhase.moonAgeDays} days into 29.5-day synodic cycle
            </div>
          </div>
        </div>
      </div>

      {/* Generation Cohort Spotlight */}
      <div className="bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="text-3xl p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
            {generation.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {generation.name}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                ({generation.years})
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {generation.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 shrink-0">
          {generation.culturalTraits.map((trait) => (
            <span
              key={trait}
              className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Planetary Ages Across the Solar System */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Orbit className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Planetary Ages (Solar System)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Because each planet has a distinct orbital period around the Sun, you are a completely different age across the cosmos!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {planetaryAges.map((planet) => {
            const isEarth = planet.planet === 'Earth';
            return (
              <div
                key={planet.planet}
                className={`rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isEarth
                    ? 'bg-amber-500/5 border-amber-500/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full inline-block shrink-0 shadow-xs"
                        style={{ backgroundColor: planet.color }}
                      />
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {planet.planet}
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Orbit: {planet.orbitalPeriodDays}d
                    </span>
                  </div>

                  <div className="my-2">
                    <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white">
                      {planet.ageOnPlanet}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1.5 font-medium">
                      {planet.planet} years old
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {planet.funFact}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Next Birthday</span>
                  <span className="font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-200">
                    in {planet.nextBirthdayDays.toLocaleString()} Earth days
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
