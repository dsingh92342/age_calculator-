import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  User,
  Heart,
  Baby,
  PawPrint,
  Users,
} from 'lucide-react';
import { SavedProfile } from '../types/index.ts';
import { calculateNextBirthday } from '../utils/ageCalculator.ts';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: SavedProfile[];
  onSaveProfiles: (profiles: SavedProfile[]) => void;
  onSelectProfile: (profile: SavedProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onSaveProfiles,
  onSelectProfile,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('1998-06-15');
  const [birthTime, setBirthTime] = useState('');
  const [relation, setRelation] = useState<SavedProfile['relation']>('friend');
  const [color, setColor] = useState('#F59E0B');

  if (!isOpen) return null;

  const colorPalette = [
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
  ];

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProfile: SavedProfile = {
      id: Date.now().toString(),
      name: name.trim(),
      birthDate,
      birthTime: birthTime || undefined,
      relation,
      color,
    };

    onSaveProfiles([...profiles, newProfile]);
    setName('');
    setIsAdding(false);
  };

  const handleDeleteProfile = (id: string) => {
    onSaveProfiles(profiles.filter((p) => p.id !== id));
  };

  // Sort profiles by upcoming birthdays!
  const sortedByUpcoming = [...profiles].map((p) => {
    const [y, m, d] = p.birthDate.split('-').map(Number);
    const bDate = new Date(y, (m || 1) - 1, d || 1);
    const nextBday = calculateNextBirthday(bDate);
    return {
      profile: p,
      nextBday,
    };
  }).sort((a, b) => a.nextBday.daysRemaining - b.nextBday.daysRemaining);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Family & Friends Profiles
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Saved birthdays, relations, and upcoming celebrations
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

        {/* Modal Body */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          {/* Add Profile Form */}
          {isAdding ? (
            <form onSubmit={handleCreateProfile} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  New Profile
                </span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="profile-name-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="profile-name-input"
                    type="text"
                    required
                    placeholder="e.g. Alex, Mom, Max"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-rel-select"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Relationship
                  </label>
                  <select
                    id="profile-rel-select"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="self">Self (Me)</option>
                    <option value="partner">Partner / Spouse</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="friend">Friend</option>
                    <option value="pet">Pet</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="profile-bdate-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Birth Date
                  </label>
                  <input
                    id="profile-bdate-input"
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-btime-input"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Birth Time (Optional)
                  </label>
                  <input
                    id="profile-btime-input"
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {colorPalette.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                        color === c ? 'scale-125 ring-2 ring-slate-900 dark:ring-white ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Save Profile
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-3 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-400 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Family Member or Friend</span>
            </button>
          )}

          {/* Upcoming Birthday Calendar / Schedule */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Upcoming Birthdays Calendar ({profiles.length})
            </span>

            {sortedByUpcoming.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-6">
                No profiles saved yet. Add your loved ones above to track their upcoming birthdays!
              </p>
            ) : (
              <div className="space-y-2">
                {sortedByUpcoming.map(({ profile: p, nextBday }) => {
                  return (
                    <div
                      key={p.id}
                      className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProfile(p);
                          onClose();
                        }}
                        className="flex items-center gap-3 text-left flex-1 cursor-pointer"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: p.color || '#F59E0B' }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                              ({p.relation})
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            Turning {nextBday.turningAge} on {nextBday.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </button>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-md">
                          {nextBday.daysRemaining === 0 ? 'Today! 🎂' : `in ${nextBday.daysRemaining}d`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteProfile(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
