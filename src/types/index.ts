export type ZodiacElement = 'Fire' | 'Earth' | 'Air' | 'Water';

export interface ZodiacSignInfo {
  name: string;
  symbol: string;
  dateRange: string;
  element: ZodiacElement;
  quality: string;
  ruler: string;
  traits: string[];
  luckyNumber: number;
  luckyColor: string;
  flower: string;
  stone: string;
}

export interface ChineseZodiacInfo {
  animal: string;
  element: string;
  chineseYear: string;
  traits: string[];
  luckyNumbers: number[];
  compatibleAnimals: string[];
}

export interface MoonPhaseInfo {
  phaseName: string;
  illumination: number; // percentage 0-100
  moonAgeDays: number;
  description: string;
  symbol: string;
}

export interface GenerationCohort {
  name: string;
  years: string;
  icon: string;
  description: string;
  culturalTraits: string[];
}

export interface PlanetaryAge {
  planet: string;
  orbitalPeriodDays: number;
  orbitalPeriodYears: number;
  ageOnPlanet: number;
  nextBirthdayDays: number;
  funFact: string;
  color: string;
  diameterRatio: string;
}

export interface LifeMilestone {
  id: string;
  title: string;
  date: Date;
  targetUnit: 'days' | 'seconds' | 'hours' | 'years';
  targetValue: number;
  isCompleted: boolean;
  daysDiff: number; // positive = days away, negative = days ago
  percentProgress: number;
  category: 'chronological' | 'time_unit' | 'cultural';
}

export interface LifeStatistics {
  heartbeats: number;
  breaths: number;
  blinks: number;
  hoursSlept: number;
  earthOrbitKm: number;
  earthRotationKm: number;
  mealsEaten: number;
}

export interface AgeCalculation {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  decimalYears: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  dayOfWeekBorn: string;
  dayOfYearBorn: number;
  isLeapYearBaby: boolean;
}

export interface NextBirthdayInfo {
  date: Date;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
  dayOfWeek: string;
  turningAge: number;
  halfBirthdayDate: Date;
  daysToHalfBirthday: number;
  progressOfYearPercent: number;
}

export interface SavedProfile {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  relation: 'self' | 'partner' | 'child' | 'parent' | 'friend' | 'pet' | 'other';
  color: string;
  avatarIcon?: string;
  petSpecies?: 'dog' | 'cat' | 'rabbit' | 'bird' | 'horse';
  dogSize?: 'small' | 'medium' | 'large';
}
