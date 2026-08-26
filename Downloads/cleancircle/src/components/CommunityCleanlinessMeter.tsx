import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  TrendingUp, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { WasteReport } from '../types';

interface CommunityCleanlinessMeterProps {
  reports: WasteReport[];
  selectedArea: string;
  onNavigateTab: (tab: string) => void;
}

export const CommunityCleanlinessMeter: React.FC<CommunityCleanlinessMeterProps> = ({
  reports,
  selectedArea,
  onNavigateTab,
}) => {
  const filteredReports = selectedArea === 'All Pilot Areas' 
    ? reports 
    : reports.filter(r => r.areaName === selectedArea);

  const totalReports = filteredReports.length || 1;
  const resolvedCount = filteredReports.filter(r => r.status === 'Resolved').length;
  const inProgressCount = filteredReports.filter(r => r.status === 'Cleaning in Progress' || r.status === 'Assigned').length;
  const reportedCount = filteredReports.filter(r => r.status === 'Reported').length;

  // Cleanliness Index Score (Calculated realistically)
  const resolutionPercentage = Math.round((resolvedCount / totalReports) * 100);
  const communityCleanIndex = Math.min(94, Math.max(68, 70 + Math.round(resolutionPercentage * 0.25)));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-lg font-bold text-slate-900">Community Cleanliness Meter</h2>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded">
              Prototype • Demo Data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulated demonstration for <strong className="text-slate-700">{selectedArea}</strong> (Apollo University & Surrounding Community)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Clean Index: {communityCleanIndex}%</span>
          </div>
          <button
            onClick={() => onNavigateTab('community')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 p-1.5 hover:bg-emerald-50 rounded-lg transition"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar & Key Ratios */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-2">
          <span>Neighborhood Cleanliness Health</span>
          <span className="font-bold text-emerald-700">{resolvedCount} of {totalReports} Hotspots Resolved ({resolutionPercentage}%)</span>
        </div>

        {/* Multi-segmented Progress Bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div 
            style={{ width: `${(resolvedCount / totalReports) * 100}%` }} 
            className="bg-emerald-500 h-full transition-all duration-500"
            title={`Resolved: ${resolvedCount}`}
          />
          <div 
            style={{ width: `${(inProgressCount / totalReports) * 100}%` }} 
            className="bg-amber-400 h-full transition-all duration-500"
            title={`Cleaning in progress: ${inProgressCount}`}
          />
          <div 
            style={{ width: `${(reportedCount / totalReports) * 100}%` }} 
            className="bg-rose-400 h-full transition-all duration-500"
            title={`Open reports: ${reportedCount}`}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Resolved ({resolvedCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>In Progress / Assigned ({inProgressCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>Newly Reported ({reportedCount})</span>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 leading-tight">231 Demo Citizens</div>
            <div className="text-[11px] text-slate-500">Apollo Univ: 142 • Surrounding: 89</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900">12-Day Streak</div>
            <div className="text-[11px] text-slate-500">Demo community clean days</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900">1.4 Tons Diverted</div>
            <div className="text-[11px] text-slate-500">Simulated diversion data</div>
          </div>
        </div>
      </div>
    </div>
  );
};
