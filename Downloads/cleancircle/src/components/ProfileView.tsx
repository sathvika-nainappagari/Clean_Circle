import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Flame, 
  Coins, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Share2, 
  QrCode,
  Edit2,
  Check,
  RotateCcw
} from 'lucide-react';
import { UserProfile, ContributorLevel } from '../types';
import { fireEcoConfetti } from '../utils/confetti';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onResetData: () => void;
}

const LEVELS: { name: ContributorLevel; minPoints: number; description: string }[] = [
  { name: 'New Contributor', minPoints: 0, description: 'Starting the daily civic cleanliness journey' },
  { name: 'Eco Contributor', minPoints: 150, description: 'Regular household segregation & active eye on street waste' },
  { name: 'Green Guardian', minPoints: 400, description: 'Neighborhood civic leader verifying cleaned spots' },
  { name: 'Community Champion', minPoints: 800, description: 'Master civic advocate driving colony-level clean corridors' }
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateUser,
  onResetData,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [name, setName] = useState<string>(user.name);
  const [neighborhood, setNeighborhood] = useState<string>(user.neighborhood);
  const [showShareNotification, setShowShareNotification] = useState<boolean>(false);

  // Level Progression Calculation
  const currentPoints = user.ecoPoints;
  const nextLevel = LEVELS.find(l => l.minPoints > currentPoints) || LEVELS[LEVELS.length - 1];
  const prevLevel = [...LEVELS].reverse().find(l => l.minPoints <= currentPoints) || LEVELS[0];

  const pointsIntoCurrentTier = currentPoints - prevLevel.minPoints;
  const tierRange = nextLevel.minPoints - prevLevel.minPoints || 1;
  const tierProgress = Math.min(100, Math.round((pointsIntoCurrentTier / tierRange) * 100));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      neighborhood,
    });
    setIsEditing(false);
    fireEcoConfetti();
  };

  const handleShareCard = () => {
    setShowShareNotification(true);
    fireEcoConfetti();
    setTimeout(() => setShowShareNotification(false), 3000);
  };

  const { reportsCount, requiredReports, segregationStreak, requiredStreak, verificationsCount, requiredVerifications } = user.verificationProgress;

  return (
    <div className="space-y-8">
      {/* Top Banner with Profile Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 text-emerald-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg border-2 border-white/20">
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">{user.name}</h2>
                {user.isVerifiedBadgeHolder && (
                  <span title="Verified Civic Contributor" className="p-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-400/30">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{user.neighborhood}</span>
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  {user.level}
                </span>
                <span className="text-xs text-slate-300">
                  Chittoor Civic Pilot
                </span>
              </div>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition flex items-center justify-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>

            <button
              onClick={handleShareCard}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Contributor Card</span>
            </button>
          </div>
        </div>

        {/* Edit Form Drawer if opened */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs rounded-xl px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Neighborhood Colony</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full text-xs rounded-xl px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}

        {showShareNotification && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center justify-between">
            <span>🎉 CleanCircle Contributor profile link copied to clipboard for sharing!</span>
          </div>
        )}
      </div>

      {/* Verification Badge Progress & Meaningful Criteria */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-600" />
              <h3 className="text-lg font-bold text-slate-900">Verified Civic Contributor Status</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              The verification badge is earned through verified consistent actions, not passive app logins.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
            <span>Badge Earned & Verified</span>
          </div>
        </div>

        {/* 3 Strict Criteria Progress Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Criteria 1 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">1. Roadside Waste Reports</span>
              <span className="font-bold text-emerald-700">{reportsCount} / {requiredReports}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                style={{ width: `${Math.min(100, (reportsCount / requiredReports) * 100)}%` }} 
                className="h-full bg-emerald-500" 
              />
            </div>
            <p className="text-[11px] text-slate-500">Min 5 photo-inspected reports</p>
          </div>

          {/* Criteria 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">2. Segregation Streak</span>
              <span className="font-bold text-amber-700">{segregationStreak} / {requiredStreak} Days</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                style={{ width: `${Math.min(100, (segregationStreak / requiredStreak) * 100)}%` }} 
                className="h-full bg-amber-500" 
              />
            </div>
            <p className="text-[11px] text-slate-500">Min 10 consecutive habit days</p>
          </div>

          {/* Criteria 3 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">3. Spot Verifications</span>
              <span className="font-bold text-teal-700">{verificationsCount} / {requiredVerifications}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                style={{ width: `${Math.min(100, (verificationsCount / requiredVerifications) * 100)}%` }} 
                className="h-full bg-teal-500" 
              />
            </div>
            <p className="text-[11px] text-slate-500">Min 3 peer-cleaned verifications</p>
          </div>
        </div>
      </div>

      {/* Contributor Level Tier Progression */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Contributor Tier Roadmap</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Current Tier: <strong className="text-emerald-700">{user.level}</strong> ({currentPoints} Eco Points)
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Next Tier: <strong>{nextLevel.name}</strong> ({nextLevel.minPoints} pts)
          </span>
        </div>

        {/* Level Roadmap Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {LEVELS.map((tier) => {
            const isUnlocked = currentPoints >= tier.minPoints;
            const isCurrent = user.level === tier.name;

            return (
              <div 
                key={tier.name}
                className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                  isCurrent 
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500' 
                    : isUnlocked 
                    ? 'border-slate-200 bg-white' 
                    : 'border-slate-100 bg-slate-50 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-bold ${isCurrent ? 'text-emerald-800' : 'text-slate-900'}`}>
                      {tier.name}
                    </span>
                    {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 block">{tier.minPoints}+ Points</span>
                  <p className="text-[11px] text-slate-600 mt-2">{tier.description}</p>
                </div>

                {isCurrent && (
                  <div className="mt-3 pt-2 border-t border-emerald-200/80 text-[10px] font-bold text-emerald-800">
                    ACTIVE TIER
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* History of Responsible Actions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>History of Responsible Actions</span>
            </h3>
            <p className="text-xs text-slate-500">Every small act counts towards a cleaner Chittoor</p>
          </div>
          <span className="text-xs font-semibold text-slate-600">{user.actionsHistory.length} Total Events</span>
        </div>

        <div className="space-y-2.5">
          {user.actionsHistory.map((act) => (
            <div 
              key={act.id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{act.title}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {act.category}
                  </span>
                </div>
                <p className="text-slate-500">{act.details}</p>
                <span className="text-[10px] text-slate-400 block">{act.timestamp}</span>
              </div>

              <span className="shrink-0 font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg">
                +{act.points} Pts
              </span>
            </div>
          ))}
        </div>

        {/* Reset Demo Data Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              if (window.confirm('Reset CleanCircle pilot demo data to fresh initial state?')) {
                onResetData();
              }
            }}
            className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Pilot Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
