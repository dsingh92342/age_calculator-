import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Printer,
  Calendar,
  Sparkles,
  Share2,
} from 'lucide-react';
import {
  calculateAge,
  calculateNextBirthday,
  getWesternZodiac,
  getChineseZodiac,
  getGenerationCohort,
} from '../utils/ageCalculator.ts';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthDateStr: string;
  name?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  birthDateStr,
  name = 'My',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const [y, m, d] = (birthDateStr || '2000-01-01').split('-').map(Number);
  const birthDate = new Date(y, (m || 1) - 1, d || 1);
  const age = calculateAge(birthDate);
  const nextBday = calculateNextBirthday(birthDate);
  const zodiac = getWesternZodiac(birthDate);
  const chineseZodiac = getChineseZodiac(birthDate);
  const gen = getGenerationCohort(birthDate);

  const summaryText = `🎉 ${name === 'My' ? 'My' : `${name}'s`} Chronos Age Summary:
• Exact Age: ${age.years} Years, ${age.months} Months, ${age.days} Days
• Total Days Alive: ${age.totalDays.toLocaleString()} days
• Total Hours Lived: ${age.totalHours.toLocaleString()} hours
• Born on: ${age.dayOfWeekBorn}, ${birthDate.toLocaleDateString()}
• Western Zodiac: ${zodiac.symbol} ${zodiac.name} (${zodiac.element})
• Chinese Zodiac: Year of the ${chineseZodiac.animal}
• Generation: ${gen.name}
• Next Birthday: Turning ${nextBday.turningAge} on ${nextBday.date.toLocaleDateString()} (in ${nextBday.daysRemaining} days!)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Share Age Summary
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Share your precision milestone snapshot with friends
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Card Preview */}
        <div className="p-5 space-y-4">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Chronos Life Record
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {birthDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-400">Exact Chronological Age</span>
              <h4 className="text-2xl font-extrabold text-white">
                {age.years}y {age.months}m {age.days}d
              </h4>
              <p className="text-xs text-amber-300 font-mono mt-0.5">
                {age.totalDays.toLocaleString()} Total Days Alive
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
              <div>
                <span className="text-slate-400 block text-[11px]">Zodiac Sign</span>
                <span className="font-semibold text-white">
                  {zodiac.symbol} {zodiac.name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Chinese Zodiac</span>
                <span className="font-semibold text-white">
                  Year of the {chineseZodiac.animal}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Generation</span>
                <span className="font-semibold text-white">{gen.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Next Birthday</span>
                <span className="font-semibold text-white">
                  Turning {nextBday.turningAge} ({nextBday.daysRemaining}d)
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
