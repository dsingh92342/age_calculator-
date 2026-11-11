import {
  AgeCalculation,
  NextBirthdayInfo,
  ZodiacSignInfo,
  ChineseZodiacInfo,
  MoonPhaseInfo,
  GenerationCohort,
  PlanetaryAge,
  LifeMilestone,
  LifeStatistics,
} from '../types/index.ts';

/**
 * Returns number of days in a given month of a given year
 */
export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/**
 * Check if a given year is a leap year in Gregorian calendar
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Calculates accurate chronological age between birthDate and targetDate
 */
export function calculateAge(birthDate: Date, targetDate: Date = new Date()): AgeCalculation {
  const isTargetBeforeBirth = targetDate.getTime() < birthDate.getTime();
  const start = isTargetBeforeBirth ? targetDate : birthDate;
  const end = isTargetBeforeBirth ? birthDate : targetDate;

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  let hours = end.getHours() - start.getHours();
  let minutes = end.getMinutes() - start.getMinutes();
  let seconds = end.getSeconds() - start.getSeconds();

  // Handle seconds borrowing
  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }

  // Handle minutes borrowing
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }

  // Handle hours borrowing
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }

  // Handle days borrowing
  if (days < 0) {
    // Borrow days from previous month of 'end'
    const prevMonth = end.getMonth() === 0 ? 11 : end.getMonth() - 1;
    const prevYear = end.getMonth() === 0 ? end.getFullYear() - 1 : end.getFullYear();
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);
    days += daysInPrevMonth;
    months -= 1;
  }

  // Handle months borrowing
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const diffMs = Math.max(0, end.getTime() - start.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);

  // Decimal years using astronomical solar year (365.2421897 days)
  const decimalYears = diffMs / (365.2421897 * 24 * 60 * 60 * 1000);
  const totalMonths = years * 12 + months + days / 30.4375;

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeekBorn = dayNames[birthDate.getDay()];

  // Day of the year
  const startOfYear = new Date(birthDate.getFullYear(), 0, 1);
  const dayOfYearBorn = Math.floor((birthDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const isLeapBaby = birthDate.getMonth() === 1 && birthDate.getDate() === 29;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    decimalYears,
    totalDays,
    totalWeeks,
    totalMonths,
    totalHours,
    totalMinutes,
    totalSeconds,
    dayOfWeekBorn,
    dayOfYearBorn,
    isLeapYearBaby: isLeapBaby,
  };
}

/**
 * Calculates upcoming birthday details and countdown
 */
export function calculateNextBirthday(birthDate: Date, now: Date = new Date()): NextBirthdayInfo {
  const currentYear = now.getFullYear();
  let bMonth = birthDate.getMonth();
  let bDay = birthDate.getDate();

  // If leap baby and target year is not leap, celebrate on March 1
  if (bMonth === 1 && bDay === 29 && !isLeapYear(currentYear)) {
    bDay = 1;
    bMonth = 2; // March
  }

  let nextBday = new Date(currentYear, bMonth, bDay, birthDate.getHours(), birthDate.getMinutes(), birthDate.getSeconds());

  // Check if birthday already passed this year (by midnight or exact time)
  if (nextBday.getTime() < now.getTime()) {
    const nextYear = currentYear + 1;
    let nextYearDay = birthDate.getDate();
    let nextYearMonth = birthDate.getMonth();
    if (nextYearMonth === 1 && nextYearDay === 29 && !isLeapYear(nextYear)) {
      nextYearDay = 1;
      nextYearMonth = 2;
    }
    nextBday = new Date(nextYear, nextYearMonth, nextYearDay, birthDate.getHours(), birthDate.getMinutes(), birthDate.getSeconds());
  }

  const diffMs = Math.max(0, nextBday.getTime() - now.getTime());
  const daysRemaining = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((diffMs % (1000 * 60)) / 1000);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = dayNames[nextBday.getDay()];

  const turningAge = nextBday.getFullYear() - birthDate.getFullYear();

  // Previous birthday
  const prevBday = new Date(nextBday);
  prevBday.setFullYear(nextBday.getFullYear() - 1);
  const totalYearDuration = nextBday.getTime() - prevBday.getTime();
  const elapsedSincePrev = now.getTime() - prevBday.getTime();
  const progressOfYearPercent = Math.min(100, Math.max(0, (elapsedSincePrev / totalYearDuration) * 100));

  // Half-birthday (6 months from birthday)
  const halfBday = new Date(birthDate);
  halfBday.setFullYear(currentYear);
  halfBday.setMonth(halfBday.getMonth() + 6);
  if (halfBday.getTime() < now.getTime()) {
    halfBday.setFullYear(currentYear + 1);
  }
  const daysToHalfBirthday = Math.max(0, Math.floor((halfBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    date: nextBday,
    daysRemaining,
    hoursRemaining,
    minutesRemaining,
    secondsRemaining,
    dayOfWeek,
    turningAge,
    halfBirthdayDate: halfBday,
    daysToHalfBirthday,
    progressOfYearPercent,
  };
}

/**
 * Western Zodiac Sign calculation
 */
export function getWesternZodiac(birthDate: Date): ZodiacSignInfo {
  const month = birthDate.getMonth() + 1; // 1-12
  const day = birthDate.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return {
      name: 'Aries',
      symbol: '♈',
      dateRange: 'Mar 21 – Apr 19',
      element: 'Fire',
      quality: 'Cardinal',
      ruler: 'Mars',
      traits: ['Pioneering', 'Bold', 'Energetic', 'Passionate'],
      luckyNumber: 9,
      luckyColor: '#EF4444',
      flower: 'Honeysuckle & Thistle',
      stone: 'Diamond',
    };
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return {
      name: 'Taurus',
      symbol: '♉',
      dateRange: 'Apr 20 – May 20',
      element: 'Earth',
      quality: 'Fixed',
      ruler: 'Venus',
      traits: ['Patient', 'Reliable', 'Devoted', 'Sensual'],
      luckyNumber: 6,
      luckyColor: '#10B981',
      flower: 'Poppy & Rose',
      stone: 'Emerald',
    };
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return {
      name: 'Gemini',
      symbol: '♊',
      dateRange: 'May 21 – Jun 20',
      element: 'Air',
      quality: 'Mutable',
      ruler: 'Mercury',
      traits: ['Adaptable', 'Curious', 'Witty', 'Expressive'],
      luckyNumber: 5,
      luckyColor: '#F59E0B',
      flower: 'Lavender & Lily of the Valley',
      stone: 'Pearl & Agate',
    };
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return {
      name: 'Cancer',
      symbol: '♋',
      dateRange: 'Jun 21 – Jul 22',
      element: 'Water',
      quality: 'Cardinal',
      ruler: 'Moon',
      traits: ['Intuitive', 'Protective', 'Empathetic', 'Sentimental'],
      luckyNumber: 2,
      luckyColor: '#94A3B8',
      flower: 'White Rose & Water Lily',
      stone: 'Ruby',
    };
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return {
      name: 'Leo',
      symbol: '♌',
      dateRange: 'Jul 23 – Aug 22',
      element: 'Fire',
      quality: 'Fixed',
      ruler: 'Sun',
      traits: ['Charismatic', 'Generous', 'Warm-hearted', 'Confident'],
      luckyNumber: 1,
      luckyColor: '#F59E0B',
      flower: 'Sunflower & Marigold',
      stone: 'Peridot',
    };
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return {
      name: 'Virgo',
      symbol: '♍',
      dateRange: 'Aug 23 – Sep 22',
      element: 'Earth',
      quality: 'Mutable',
      ruler: 'Mercury',
      traits: ['Analytical', 'Meticulous', 'Practical', 'Loyal'],
      luckyNumber: 5,
      luckyColor: '#059669',
      flower: 'Buttercup & Chrysanthemum',
      stone: 'Sapphire',
    };
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return {
      name: 'Libra',
      symbol: '♎',
      dateRange: 'Sep 23 – Oct 22',
      element: 'Air',
      quality: 'Cardinal',
      ruler: 'Venus',
      traits: ['Harmonious', 'Diplomatic', 'Graceful', 'Fair-minded'],
      luckyNumber: 7,
      luckyColor: '#EC4899',
      flower: 'Rose & Bluebell',
      stone: 'Opal & Tourmaline',
    };
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return {
      name: 'Scorpio',
      symbol: '♏',
      dateRange: 'Oct 23 – Nov 21',
      element: 'Water',
      quality: 'Fixed',
      ruler: 'Pluto & Mars',
      traits: ['Passionate', 'Resourceful', 'Perceptive', 'Magnetic'],
      luckyNumber: 8,
      luckyColor: '#881337',
      flower: 'Geranium & Rhododendron',
      stone: 'Topaz & Citrine',
    };
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return {
      name: 'Sagittarius',
      symbol: '♐',
      dateRange: 'Nov 22 – Dec 21',
      element: 'Fire',
      quality: 'Mutable',
      ruler: 'Jupiter',
      traits: ['Adventurous', 'Philosophical', 'Optimistic', 'Free-spirited'],
      luckyNumber: 3,
      luckyColor: '#8B5CF6',
      flower: 'Carnation & Peony',
      stone: 'Turquoise & Tanzanite',
    };
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    return {
      name: 'Capricorn',
      symbol: '♑',
      dateRange: 'Dec 22 – Jan 19',
      element: 'Earth',
      quality: 'Cardinal',
      ruler: 'Saturn',
      traits: ['Ambitious', 'Disciplined', 'Tenacious', 'Strategic'],
      luckyNumber: 4,
      luckyColor: '#475569',
      flower: 'Pansy & Ivy',
      stone: 'Garnet',
    };
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return {
      name: 'Aquarius',
      symbol: '♒',
      dateRange: 'Jan 20 – Feb 18',
      element: 'Air',
      quality: 'Fixed',
      ruler: 'Uranus & Saturn',
      traits: ['Visionary', 'Original', 'Humanitarian', 'Independent'],
      luckyNumber: 11,
      luckyColor: '#06B6D4',
      flower: 'Orchid & Bird of Paradise',
      stone: 'Amethyst',
    };
  } else {
    return {
      name: 'Pisces',
      symbol: '♓',
      dateRange: 'Feb 19 – Mar 20',
      element: 'Water',
      quality: 'Mutable',
      ruler: 'Neptune & Jupiter',
      traits: ['Compassionate', 'Artistic', 'Dreamy', 'Intuitive'],
      luckyNumber: 7,
      luckyColor: '#3B82F6',
      flower: 'Water Lily & Violet',
      stone: 'Aquamarine',
    };
  }
}

/**
 * Chinese Lunar Zodiac calculation
 */
export function getChineseZodiac(birthDate: Date): ChineseZodiacInfo {
  const year = birthDate.getFullYear();
  // Approximate lunar new year start (Feb 4 average solar term Lichun)
  const isBeforeLunarNY = birthDate.getMonth() === 0 || (birthDate.getMonth() === 1 && birthDate.getDate() < 4);
  const lunarYear = isBeforeLunarNY ? year - 1 : year;

  const animals = [
    { animal: 'Rat', traits: ['Resourceful', 'Clever', 'Quick-witted'], luckyNumbers: [2, 3], compatible: ['Ox', 'Dragon', 'Monkey'] },
    { animal: 'Ox', traits: ['Diligent', 'Dependable', 'Strong', 'Determined'], luckyNumbers: [1, 4], compatible: ['Rat', 'Snake', 'Rooster'] },
    { animal: 'Tiger', traits: ['Brave', 'Confident', 'Charismatic', 'Unpredictable'], luckyNumbers: [1, 3, 4], compatible: ['Horse', 'Dog', 'Pig'] },
    { animal: 'Rabbit', traits: ['Gentle', 'Quiet', 'Elegant', 'Alert'], luckyNumbers: [3, 4, 6], compatible: ['Goat', 'Monkey', 'Dog', 'Pig'] },
    { animal: 'Dragon', traits: ['Ambitious', 'Energetic', 'Noble', 'Intelligent'], luckyNumbers: [1, 6, 7], compatible: ['Rooster', 'Rat', 'Monkey'] },
    { animal: 'Snake', traits: ['Enigmatic', 'Wise', 'Intuitive', 'Sophisticated'], luckyNumbers: [2, 8, 9], compatible: ['Dragon', 'Rooster'] },
    { animal: 'Horse', traits: ['Animated', 'Active', 'Independent', 'Passionate'], luckyNumbers: [2, 3, 7], compatible: ['Tiger', 'Goat', 'Dog'] },
    { animal: 'Goat', traits: ['Calm', 'Gentle', 'Empathetic', 'Artistic'], luckyNumbers: [2, 7], compatible: ['Rabbit', 'Horse', 'Pig'] },
    { animal: 'Monkey', traits: ['Smart', 'Lively', 'Innovative', 'Curious'], luckyNumbers: [4, 9], compatible: ['Rat', 'Dragon', 'Snake'] },
    { animal: 'Rooster', traits: ['Observant', 'Hardworking', 'Courageous', 'Talented'], luckyNumbers: [5, 7, 8], compatible: ['Ox', 'Snake'] },
    { animal: 'Dog', traits: ['Loyal', 'Honest', 'Warm', 'Affectionate'], luckyNumbers: [3, 4, 9], compatible: ['Tiger', 'Rabbit', 'Horse'] },
    { animal: 'Pig', traits: ['Compassionate', 'Generous', 'Diligent', 'Sociable'], luckyNumbers: [2, 5, 8], compatible: ['Tiger', 'Rabbit', 'Goat'] },
  ];

  // 1900 was Year of the Rat (index 0)
  const offset = (lunarYear - 1900) % 12;
  const index = offset >= 0 ? offset : offset + 12;
  const animalData = animals[index];

  // 5 Heavenly Elements based on last digit of lunar year
  const elementIndex = Math.floor(((lunarYear % 10) + 10) % 10 / 2);
  const elements = ['Metal', 'Water', 'Wood', 'Fire', 'Earth'];
  // Adjust: 0,1 = Metal, 2,3 = Water, 4,5 = Wood, 6,7 = Fire, 8,9 = Earth
  const lastDigit = ((lunarYear % 10) + 10) % 10;
  let element = 'Wood';
  if (lastDigit === 0 || lastDigit === 1) element = 'Metal';
  else if (lastDigit === 2 || lastDigit === 3) element = 'Water';
  else if (lastDigit === 4 || lastDigit === 5) element = 'Wood';
  else if (lastDigit === 6 || lastDigit === 7) element = 'Fire';
  else if (lastDigit === 8 || lastDigit === 9) element = 'Earth';

  return {
    animal: animalData.animal,
    element,
    chineseYear: `${element} ${animalData.animal} (${lunarYear})`,
    traits: animalData.traits,
    luckyNumbers: animalData.luckyNumbers,
    compatibleAnimals: animalData.compatible,
  };
}

/**
 * Historical Moon Phase calculation using Conway / synodic cycle math
 */
export function getMoonPhase(birthDate: Date): MoonPhaseInfo {
  // Known reference new moon: January 6, 2000, 18:14 UTC
  const refTime = new Date(Date.UTC(2000, 0, 6, 18, 14, 0)).getTime();
  const birthTime = birthDate.getTime();
  const synodicMonthMs = 29.530588853 * 24 * 60 * 60 * 1000;

  let diff = (birthTime - refTime) % synodicMonthMs;
  if (diff < 0) diff += synodicMonthMs;

  const ageDays = diff / (24 * 60 * 60 * 1000);
  const cycleFraction = ageDays / 29.530588853;
  // Illumination percentage (0 to 100)
  const illumination = Math.round(((1 - Math.cos(cycleFraction * 2 * Math.PI)) / 2) * 100);

  let phaseName = 'New Moon';
  let description = 'Born under a dark sky, initiating new beginnings and deep reflection.';
  let symbol = '🌑';

  if (ageDays < 1.84 || ageDays >= 27.68) {
    phaseName = 'New Moon';
    symbol = '🌑';
    description = 'Spontaneous, instinctive, and drawn to start fresh journeys.';
  } else if (ageDays < 5.53) {
    phaseName = 'Waxing Crescent';
    symbol = '🌒';
    description = 'Determined, forward-thinking, and eager to grow and overcome obstacles.';
  } else if (ageDays < 9.23) {
    phaseName = 'First Quarter';
    symbol = '🌓';
    description = 'Action-oriented, resilient, and thrives when navigating challenges.';
  } else if (ageDays < 12.92) {
    phaseName = 'Waxing Gibbous';
    symbol = '🌔';
    description = 'Refining, perceptive, and focused on mastery and self-improvement.';
  } else if (ageDays < 16.61) {
    phaseName = 'Full Moon';
    symbol = '🌕';
    description = 'Expressive, charismatic, and deeply connected to emotion and intuition.';
  } else if (ageDays < 20.30) {
    phaseName = 'Waning Gibbous (Disseminating)';
    symbol = '🌖';
    description = 'Communicative, wise, and motivated to share knowledge with community.';
  } else if (ageDays < 23.99) {
    phaseName = 'Last Quarter';
    symbol = '🌗';
    description = 'Reflective, mature, and skilled at synthesizing lessons from experience.';
  } else {
    phaseName = 'Waning Crescent (Balsamic)';
    symbol = '🌘';
    description = 'Philosophical, visionary, and guided by quiet inner wisdom.';
  }

  return {
    phaseName,
    illumination,
    moonAgeDays: Math.round(ageDays * 10) / 10,
    description,
    symbol,
  };
}

/**
 * Generation cohort based on birth year
 */
export function getGenerationCohort(birthDate: Date): GenerationCohort {
  const year = birthDate.getFullYear();

  if (year >= 2025) {
    return {
      name: 'Generation Beta',
      years: '2025 – 2039',
      icon: '🌱',
      description: 'The upcoming AI-native generation growing up in a deeply interconnected world.',
      culturalTraits: ['AI-native', 'Hyper-personalized education', 'Climate-conscious'],
    };
  } else if (year >= 2013) {
    return {
      name: 'Generation Alpha',
      years: '2013 – 2024',
      icon: '🚀',
      description: 'First generation entirely born in the 21st century, growing up with voice assistants and touchscreens.',
      culturalTraits: ['Seamless digital integration', 'Global connectivity', 'Dynamic creators'],
    };
  } else if (year >= 1997) {
    return {
      name: 'Generation Z',
      years: '1997 – 2012',
      icon: '⚡',
      description: 'Digital natives renowned for social awareness, authenticity, and entrepreneurial agility.',
      culturalTraits: ['Digital native', 'Authenticity driven', 'Values mental wellness', 'Pragmatic'],
    };
  } else if (year >= 1981) {
    return {
      name: 'Millennial (Gen Y)',
      years: '1981 – 1996',
      icon: '💡',
      description: 'Pioneered the transition from analog to digital; values experiences and purposeful impact.',
      culturalTraits: ['Tech adaptive', 'Experience focused', 'Collaborative', 'Civically engaged'],
    };
  } else if (year >= 1965) {
    return {
      name: 'Generation X',
      years: '1965 – 1980',
      icon: '🎧',
      description: 'The fiercely independent bridge generation that witnessed the birth of the personal computer.',
      culturalTraits: ['Self-reliant', 'Work-life balance pioneers', 'Resourceful', 'Adaptable'],
    };
  } else if (year >= 1946) {
    return {
      name: 'Baby Boomer',
      years: '1946 – 1964',
      icon: '🏛️',
      description: 'A transformative generation defined by cultural shifts, dedication, and institutional restructuring.',
      culturalTraits: ['Goal-driven', 'Competitive', 'Community focused', 'Resilient'],
    };
  } else if (year >= 1928) {
    return {
      name: 'Silent Generation',
      years: '1928 – 1945',
      icon: '📜',
      description: 'Known for traditional resilience, civic duty, quiet determination, and rebuilding.',
      culturalTraits: ['Hardworking', 'Disciplined', 'Loyal', 'Financial prudence'],
    };
  } else {
    return {
      name: 'Greatest Generation',
      years: 'Before 1928',
      icon: '⭐',
      description: 'The monumental generation that endured great global challenges with quiet valor.',
      culturalTraits: ['Self-sacrifice', 'Endurance', 'Unwavering duty'],
    };
  }
}

/**
 * Calculates planetary ages across the Solar System
 */
export function getPlanetaryAges(totalDaysLived: number): PlanetaryAge[] {
  const planets = [
    {
      planet: 'Mercury',
      orbitalPeriodDays: 87.97,
      orbitalPeriodYears: 0.2408,
      funFact: 'One year on Mercury is shorter than one of its own days (which lasts 176 Earth days)!',
      color: '#A8A29E',
      diameterRatio: '0.38x Earth',
    },
    {
      planet: 'Venus',
      orbitalPeriodDays: 224.7,
      orbitalPeriodYears: 0.6152,
      funFact: 'Venus rotates backwards compared to most other planets, so the Sun rises in the west.',
      color: '#FBBF24',
      diameterRatio: '0.95x Earth',
    },
    {
      planet: 'Earth',
      orbitalPeriodDays: 365.256,
      orbitalPeriodYears: 1.0,
      funFact: 'The home base of all your celebrated birthdays so far!',
      color: '#38BDF8',
      diameterRatio: '1.0x Earth',
    },
    {
      planet: 'Mars',
      orbitalPeriodDays: 686.98,
      orbitalPeriodYears: 1.8808,
      funFact: 'Mars is home to Olympus Mons, a volcano three times taller than Mount Everest.',
      color: '#F87171',
      diameterRatio: '0.53x Earth',
    },
    {
      planet: 'Jupiter',
      orbitalPeriodDays: 4332.59,
      orbitalPeriodYears: 11.862,
      funFact: 'Jupiter is so massive that over 1,300 Earths could easily fit inside it.',
      color: '#FB923C',
      diameterRatio: '11.2x Earth',
    },
    {
      planet: 'Saturn',
      orbitalPeriodDays: 10759.22,
      orbitalPeriodYears: 29.457,
      funFact: 'Saturn could float in water if you found a bathtub large enough.',
      color: '#FDE047',
      diameterRatio: '9.45x Earth',
    },
    {
      planet: 'Uranus',
      orbitalPeriodDays: 30685.4,
      orbitalPeriodYears: 84.02,
      funFact: 'Uranus rolls on its side at an extreme 98-degree tilt throughout its orbit.',
      color: '#2DD4BF',
      diameterRatio: '4.0x Earth',
    },
    {
      planet: 'Neptune',
      orbitalPeriodDays: 60189.0,
      orbitalPeriodYears: 164.8,
      funFact: 'Neptune has only completed one single orbit around the Sun since its discovery in 1846!',
      color: '#60A5FA',
      diameterRatio: '3.88x Earth',
    },
    {
      planet: 'Pluto',
      orbitalPeriodDays: 90560.0,
      orbitalPeriodYears: 247.94,
      funFact: 'A person would need to live ~248 Earth years to celebrate their 1st Pluto birthday.',
      color: '#C084FC',
      diameterRatio: '0.18x Earth',
    },
  ];

  return planets.map((p) => {
    const ageOnPlanet = totalDaysLived / p.orbitalPeriodDays;
    const wholeAge = Math.floor(ageOnPlanet);
    const nextBirthdayDays = Math.round((wholeAge + 1) * p.orbitalPeriodDays - totalDaysLived);

    return {
      planet: p.planet,
      orbitalPeriodDays: p.orbitalPeriodDays,
      orbitalPeriodYears: p.orbitalPeriodYears,
      ageOnPlanet: Math.round(ageOnPlanet * 100) / 100,
      nextBirthdayDays: Math.max(0, nextBirthdayDays),
      funFact: p.funFact,
      color: p.color,
      diameterRatio: p.diameterRatio,
    };
  });
}

/**
 * Calculates biological life statistics
 */
export function calculateLifeStats(totalDaysLived: number, totalMinutesLived: number): LifeStatistics {
  // Average resting heart rate ~ 72 bpm
  const heartbeats = Math.round(totalMinutesLived * 72);
  // Average breaths ~ 15 per minute
  const breaths = Math.round(totalMinutesLived * 15);
  // Average eye blinks ~ 16 per minute (awake ~16 hrs/day)
  const awakeMinutes = totalMinutesLived * (16 / 24);
  const blinks = Math.round(awakeMinutes * 17);
  // Sleep ~ 8 hours per day
  const hoursSlept = Math.round(totalDaysLived * 8);
  // Earth orbit speed ~ 2.57 million km per day (940M km / 365.25 days)
  const earthOrbitKm = Math.round(totalDaysLived * 2573579);
  // Earth rotation speed at typical latitude ~ 28,000 km per day
  const earthRotationKm = Math.round(totalDaysLived * 28000);
  // Meals ~ 3 per day
  const mealsEaten = Math.round(totalDaysLived * 3);

  return {
    heartbeats,
    breaths,
    blinks,
    hoursSlept,
    earthOrbitKm,
    earthRotationKm,
    mealsEaten,
  };
}

/**
 * Generates significant milestones (past and future)
 */
export function getLifeMilestones(birthDate: Date, now: Date = new Date()): LifeMilestone[] {
  const milestones: LifeMilestone[] = [];
  const birthMs = birthDate.getTime();
  const nowMs = now.getTime();

  // Day milestones
  const dayTargets = [1000, 2500, 5000, 7500, 10000, 15000, 20000, 25000, 30000];
  dayTargets.forEach((target) => {
    const targetDate = new Date(birthMs + target * 24 * 60 * 60 * 1000);
    const diffDays = Math.round((targetDate.getTime() - nowMs) / (24 * 60 * 60 * 1000));
    const elapsedDays = Math.max(0, (nowMs - birthMs) / (24 * 60 * 60 * 1000));
    const progress = Math.min(100, Math.max(0, (elapsedDays / target) * 100));

    milestones.push({
      id: `days-${target}`,
      title: `${target.toLocaleString()} Days Alive`,
      date: targetDate,
      targetUnit: 'days',
      targetValue: target,
      isCompleted: diffDays <= 0,
      daysDiff: diffDays,
      percentProgress: Math.round(progress),
      category: 'time_unit',
    });
  });

  // Second / Hour milestones
  const secondTargets = [
    { label: '500 Million Seconds', value: 500000000, unit: 'seconds' as const },
    { label: '1 Billion Seconds', value: 1000000000, unit: 'seconds' as const },
    { label: '2 Billion Seconds', value: 2000000000, unit: 'seconds' as const },
    { label: '250,000 Hours', value: 250000, unit: 'hours' as const },
    { label: '500,000 Hours', value: 500000, unit: 'hours' as const },
  ];

  secondTargets.forEach((item) => {
    const msToAdd = item.unit === 'seconds' ? item.value * 1000 : item.value * 60 * 60 * 1000;
    const targetDate = new Date(birthMs + msToAdd);
    const diffDays = Math.round((targetDate.getTime() - nowMs) / (24 * 60 * 60 * 1000));
    const elapsedMs = Math.max(0, nowMs - birthMs);
    const progress = Math.min(100, Math.max(0, (elapsedMs / msToAdd) * 100));

    milestones.push({
      id: `time-${item.label.replace(/\s+/g, '-').toLowerCase()}`,
      title: item.label,
      date: targetDate,
      targetUnit: item.unit,
      targetValue: item.value,
      isCompleted: diffDays <= 0,
      daysDiff: diffDays,
      percentProgress: Math.round(progress),
      category: 'time_unit',
    });
  });

  // Key Jubilee & cultural age milestones
  const yearTargets = [
    { age: 18, title: 'Adulthood (Age 18)' },
    { age: 21, title: 'Legal Milestone (Age 21)' },
    { age: 25, title: 'Silver Jubilee (Quarter Century)' },
    { age: 30, title: 'Flourishing Thirties (Age 30)' },
    { age: 40, title: 'Fabulous Forties (Age 40)' },
    { age: 50, title: 'Golden Jubilee (Half Century)' },
    { age: 60, title: 'Diamond Jubilee (Age 60)' },
    { age: 75, title: 'Platinum Milestone (Age 75)' },
    { age: 100, title: 'Centenarian (100 Years)' },
  ];

  yearTargets.forEach((yt) => {
    const targetDate = new Date(birthDate);
    targetDate.setFullYear(birthDate.getFullYear() + yt.age);
    const diffDays = Math.round((targetDate.getTime() - nowMs) / (24 * 60 * 60 * 1000));
    const elapsedYears = (nowMs - birthMs) / (365.2425 * 24 * 60 * 60 * 1000);
    const progress = Math.min(100, Math.max(0, (elapsedYears / yt.age) * 100));

    milestones.push({
      id: `age-${yt.age}`,
      title: yt.title,
      date: targetDate,
      targetUnit: 'years',
      targetValue: yt.age,
      isCompleted: diffDays <= 0,
      daysDiff: diffDays,
      percentProgress: Math.round(progress),
      category: 'cultural',
    });
  });

  // Sort by target date
  return milestones.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Pet age calculator with science-based formulas
 */
export function calculatePetAge(
  species: 'dog' | 'cat' | 'rabbit' | 'bird' | 'horse',
  calendarAgeYears: number,
  dogSize: 'small' | 'medium' | 'large' = 'medium'
): { humanAge: number; lifeStage: string; careTip: string } {
  const age = Math.max(0, calendarAgeYears);

  if (species === 'dog') {
    let humanAge = 0;
    if (age <= 0) {
      humanAge = 0;
    } else if (age < 1) {
      humanAge = Math.round(age * 15);
    } else if (age <= 2) {
      humanAge = Math.round(15 + (age - 1) * 9);
    } else {
      // 2 years ~ 24 human years
      const rate = dogSize === 'small' ? 4 : dogSize === 'medium' ? 5 : 6.5;
      humanAge = Math.round(24 + (age - 2) * rate);
    }

    let lifeStage = 'Puppy';
    if (age >= 11 || humanAge >= 70) lifeStage = 'Senior / Geriatric';
    else if (age >= 7 || humanAge >= 50) lifeStage = 'Mature Adult';
    else if (age >= 2) lifeStage = 'Prime Adult';
    else if (age >= 1) lifeStage = 'Junior';

    const careTip =
      lifeStage === 'Puppy'
        ? 'Critical window for positive socialization, foundational obedience, and booster vaccines.'
        : lifeStage === 'Junior'
        ? 'High physical and cognitive energy; engage with puzzle toys and varied agility exercises.'
        : lifeStage === 'Prime Adult'
        ? 'Maintain consistent dental cleaning and lean body condition to safeguard joints.'
        : 'Schedule biannual veterinary wellness exams, monitor joint flexibility, and feed senior-formulated diets.';

    return { humanAge, lifeStage, careTip };
  }

  if (species === 'cat') {
    let humanAge = 0;
    if (age <= 0) humanAge = 0;
    else if (age <= 1) humanAge = Math.round(age * 15);
    else if (age <= 2) humanAge = Math.round(15 + (age - 1) * 9); // 24 at 2 years
    else humanAge = Math.round(24 + (age - 2) * 4);

    let lifeStage = 'Kitten';
    if (age >= 15 || humanAge >= 75) lifeStage = 'Super Senior';
    else if (age >= 11 || humanAge >= 60) lifeStage = 'Senior';
    else if (age >= 7) lifeStage = 'Mature Adult';
    else if (age >= 2) lifeStage = 'Prime Adult';
    else if (age >= 1) lifeStage = 'Junior';

    const careTip =
      lifeStage === 'Kitten'
        ? 'Focus on early gentle handling, litter training, and vaccination cycles.'
        : lifeStage === 'Senior' || lifeStage === 'Super Senior'
        ? 'Cats mask discomfort; track hydration, kidney markers, and provide accessible low-step litter boxes.'
        : 'Encourage daily hunting play sessions and provide elevated vertical scratching posts.';

    return { humanAge, lifeStage, careTip };
  }

  if (species === 'rabbit') {
    let humanAge = 0;
    if (age <= 1) humanAge = Math.round(age * 16);
    else if (age <= 2) humanAge = Math.round(16 + (age - 1) * 11);
    else humanAge = Math.round(27 + (age - 2) * 6);

    const lifeStage = age < 1 ? 'Kit' : age < 5 ? 'Adult' : 'Senior';
    const careTip = 'Rabbits require 80%+ fresh timothy hay for proper gut motility and continuous tooth wear.';
    return { humanAge, lifeStage, careTip };
  }

  if (species === 'bird') {
    // Companion parrots/parakeets have long lifespans
    const humanAge = Math.round(age * 2.8);
    const lifeStage = age < 1 ? 'Fledgling' : age < 15 ? 'Adult' : 'Senior';
    const careTip = 'Provide UV-B light access, fresh leafy greens, and daily vocal interaction.';
    return { humanAge, lifeStage, careTip };
  }

  // Horse
  let humanAge = 0;
  if (age <= 1) humanAge = Math.round(age * 6.5);
  else if (age <= 2) humanAge = Math.round(13);
  else if (age <= 3) humanAge = Math.round(18);
  else if (age <= 4) humanAge = Math.round(22);
  else humanAge = Math.round(22 + (age - 4) * 2.5);

  const lifeStage = age < 2 ? 'Foal / Yearling' : age < 5 ? 'Colt / Filly' : age < 18 ? 'Prime Equine' : 'Veteran';
  const careTip = 'Routine hoof trimming every 6 weeks and regular equine dental floating are essential.';
  return { humanAge, lifeStage, careTip };
}

/**
 * Calculates the exact age difference between two dates
 */
export function calculateAgeDifference(date1: Date, date2: Date) {
  const olderDate = date1 < date2 ? date1 : date2;
  const youngerDate = date1 < date2 ? date2 : date1;
  const isFirstPersonOlder = date1 < date2;

  const diff = calculateAge(olderDate, youngerDate);

  // Exact "Double Age" mathematical moment:
  // When is Person A exactly twice as old as Person B?
  // Let T be time. T - D1 = 2 * (T - D2) => T - D1 = 2T - 2D2 => T = 2D2 - D1
  const t1 = olderDate.getTime();
  const t2 = youngerDate.getTime();
  const doubleAgeMs = 2 * t2 - t1;
  const doubleAgeDate = new Date(doubleAgeMs);

  return {
    diff,
    isFirstPersonOlder,
    olderDate,
    youngerDate,
    doubleAgeDate,
    hasDoubleAgePassed: doubleAgeDate.getTime() < Date.now(),
  };
}
