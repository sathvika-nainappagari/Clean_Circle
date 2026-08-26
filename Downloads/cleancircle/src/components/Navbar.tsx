import React from 'react';
import { 
  Flame, 
  Coins, 
  ShieldCheck, 
  MapPin, 
  PlusCircle, 
  Trash2, 
  Users, 
  Activity, 
  User as UserIcon,
  Recycle
} from 'lucide-react';
import { UserProfile } from '../types';
import { CHITTOOR_AREAS } from '../data/mockData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  onOpenReportModal: () => void;
  onOpenBulkModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  selectedArea,
  setSelectedArea,
  onOpenReportModal,
  onOpenBulkModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner / Location Pilot Bar */}
      <div className="bg-emerald-800 text-emerald-50 px-4 py-1.5 text-xs font-medium flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-200">Pilot Context:</span>
          <span>Apollo University Campus & Surrounding Community, Chittoor</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-emerald-950/80 text-emerald-300 rounded border border-emerald-700/60">
            Prototype • Demo Data
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-300" />
          <select 
            id="area-selector"
            aria-label="Select Neighborhood Area"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-emerald-900/80 text-white text-xs rounded-md px-2 py-0.5 border border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          >
            <option value="All Pilot Areas">📍 All Chittoor Pilot Sectors</option>
            {CHITTOOR_AREAS.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Prototype Demo Disclaimer Strip */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1 text-[11px] text-amber-900 flex items-center justify-center text-center">
        <span>
          <strong>Demo Data</strong> — This prototype uses simulated data and workflows for demonstration purposes. The statistics, community members, Eco Points, streaks, reports, and municipal workflows are not real-world deployment data.
        </span>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            id="brand-logo-btn"
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6 text-emerald-50" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Clean<span className="text-emerald-600">Circle</span>
                  <span className="text-slate-400 font-normal ml-1.5 text-sm sm:text-base">— Prototype Demo</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded">
                  Demo Data
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none">Apollo University & Surrounding Community Pilot</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-tab-home"
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'home' 
                  ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>
            <button
              id="nav-tab-report"
              onClick={() => setActiveTab('report')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'report' 
                  ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Report Waste
            </button>
            <button
              id="nav-tab-disposal"
              onClick={() => setActiveTab('disposal')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'disposal' 
                  ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Proper Disposal
            </button>
            <button
              id="nav-tab-community"
              onClick={() => setActiveTab('community')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'community' 
                  ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Community
            </button>
            <button
              id="nav-tab-impact"
              onClick={() => setActiveTab('impact')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'impact' 
                  ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Civic Impact
            </button>
            <button
              id="nav-tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Profile & Badges
            </button>
          </nav>

          {/* Quick Stats & Action Button */}
          <div className="flex items-center gap-3">
            {/* Clean Streak Badge */}
            <div 
              title="Your Clean Habit Streak"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-amber-800 text-xs font-semibold"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{user.streakDays}d Streak</span>
            </div>

            {/* Eco Points */}
            <div 
              title="Earned through responsible actions"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-800 text-xs font-semibold"
            >
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>{user.ecoPoints} Pts</span>
            </div>

            {/* Report Button */}
            <button
              id="header-report-btn"
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg shadow-sm transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Report Waste</span>
              <span className="sm:hidden">Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 flex justify-around items-center shadow-xl safe-area-bottom"
      >
        <button
          id="mobile-nav-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] min-h-[48px] transition-colors ${
            activeTab === 'home' 
              ? 'text-emerald-700 font-bold bg-emerald-50/80' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">Home</span>
        </button>

        <button
          id="mobile-nav-report"
          onClick={() => setActiveTab('report')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] min-h-[48px] transition-colors ${
            activeTab === 'report' 
              ? 'text-emerald-700 font-bold bg-emerald-50/80' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trash2 className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">Report</span>
        </button>

        <button
          id="mobile-nav-disposal"
          onClick={() => setActiveTab('disposal')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] min-h-[48px] transition-colors ${
            activeTab === 'disposal' 
              ? 'text-emerald-700 font-bold bg-emerald-50/80' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Recycle className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">Dispose</span>
        </button>

        <button
          id="mobile-nav-community"
          onClick={() => setActiveTab('community')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] min-h-[48px] transition-colors ${
            activeTab === 'community' 
              ? 'text-emerald-700 font-bold bg-emerald-50/80' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">Community</span>
        </button>

        <button
          id="mobile-nav-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] min-h-[48px] transition-colors ${
            activeTab === 'profile' 
              ? 'text-emerald-700 font-bold bg-emerald-50/80' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-tight">Profile</span>
        </button>
      </nav>
    </header>
  );
};
