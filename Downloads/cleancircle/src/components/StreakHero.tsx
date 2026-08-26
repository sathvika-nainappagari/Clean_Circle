import React from 'react';
import { 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  ArrowRight, 
  Camera, 
  Recycle, 
  Truck, 
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface StreakHeroProps {
  user: UserProfile;
  onNavigateTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenBulkModal: () => void;
}

export const StreakHero: React.FC<StreakHeroProps> = ({
  user,
  onNavigateTab,
  onOpenReportModal,
  onOpenBulkModal
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl">
      {/* Subtle background nature grid circles */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative px-6 py-8 sm:px-10 sm:py-10">
        {/* Core Civic Manifesto / Headline */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Cleanliness is a Daily Habit, Not a One-Day Campaign</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Keep Our Campus & Neighborhoods <span className="text-emerald-400 underline decoration-emerald-500/50 decoration-wavy">Clean</span>.
          </h1>

          <p className="mt-2.5 text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            A civic community platform for Apollo University and surrounding neighborhoods. 
            Maintain your daily clean habits, segregate waste at home, report roadside litter with AI assistance, and earn community Eco Points.
          </p>
        </div>

        {/* User Contributor Stats Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {/* Clean Streak */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Clean Streak</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Flame className="w-5 h-5 fill-amber-400" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{user.streakDays}</span>
              <span className="text-xs text-amber-300 ml-1 font-semibold">Days Active</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Logged daily clean action</p>
          </div>

          {/* Eco Points */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Eco Points</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Coins className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{user.ecoPoints}</span>
              <span className="text-xs text-emerald-300 ml-1 font-semibold">Earned</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Redeemable civic credits</p>
          </div>

          {/* Contributor Level */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Civic Tier</span>
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-sm sm:text-base font-bold text-white leading-tight">{user.level}</div>
            </div>
            <p className="text-[11px] text-teal-300 mt-1">Apollo Pilot Contributor</p>
          </div>

          {/* Verification Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Verification</span>
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2">
              <div className="inline-flex items-center gap-1 text-xs font-bold text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Citizen</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Earned via verified actions</p>
          </div>
        </div>

        {/* Action Buttons Bar - Primary Report Waste Action */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            id="hero-report-btn"
            onClick={onOpenReportModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition active:scale-98 text-sm sm:text-base min-h-[48px]"
          >
            <Camera className="w-5 h-5" />
            <span>Report Waste & Litter</span>
          </button>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              id="hero-disposal-btn"
              onClick={() => onNavigateTab('disposal')}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-3.5 py-3 rounded-xl border border-white/15 transition text-xs sm:text-sm min-h-[44px]"
            >
              <Recycle className="w-4 h-4 text-emerald-400" />
              <span>Waste Guide</span>
            </button>

            <button
              id="hero-bulk-btn"
              onClick={onOpenBulkModal}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-3.5 py-3 rounded-xl border border-white/15 transition text-xs sm:text-sm min-h-[44px]"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Bulk Pickup</span>
            </button>
          </div>

          <button
            id="hero-community-btn"
            onClick={() => onNavigateTab('community')}
            className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-300 hover:text-white font-medium px-2 py-2 text-xs sm:text-sm sm:ml-auto group min-h-[40px]"
          >
            <span>Community Missions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
