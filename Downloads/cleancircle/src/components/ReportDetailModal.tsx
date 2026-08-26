import React from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  Info, 
  User,
  Share2
} from 'lucide-react';
import { WasteReport } from '../types';

interface ReportDetailModalProps {
  report: WasteReport | null;
  onClose: () => void;
  onVerify: (reportId: string) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onVerify,
}) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
              report.status === 'Resolved' ? 'bg-emerald-500 text-white' :
              report.status === 'Cleaning in Progress' ? 'bg-sky-500 text-white' :
              report.status === 'Assigned' ? 'bg-amber-500 text-slate-950' :
              'bg-rose-500 text-white'
            }`}>
              {report.status}
            </span>
            <span className="text-xs text-slate-300">ID: {report.id}</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
              Prototype Demo Workflow
            </span>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{report.title}</h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{report.location}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Reported {report.reportedAt} by {report.reportedBy}</span>
              </span>
            </div>
          </div>

          {/* Photo Section (Single or Before/After) */}
          {report.status === 'Resolved' && report.resolvedImageUrl ? (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700">Before & After Resolution:</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden border border-slate-200 relative bg-slate-100">
                  <img 
                    src={report.imageUrl} 
                    alt="Before" 
                    className="w-full h-44 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-bold rounded">
                    BEFORE (REPORTED)
                  </span>
                </div>

                <div className="rounded-xl overflow-hidden border border-emerald-300 relative bg-emerald-50">
                  <img 
                    src={report.resolvedImageUrl} 
                    alt="Cleaned" 
                    className="w-full h-44 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded">
                    AFTER (CLEANED)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border border-slate-200">
              <img 
                src={report.imageUrl} 
                alt={report.title} 
                className="w-full h-60 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Citizen Description */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
            <span className="font-bold text-slate-700 block mb-1">Citizen Description:</span>
            <p className="text-slate-600 leading-relaxed">{report.description}</p>
          </div>

          {/* AI Inspection Card */}
          {report.analysis && (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-950">AI Waste & Hazard Diagnostics</span>
                </div>
                <span className="text-xs font-bold text-emerald-800">
                  {report.analysis.severity === 'None' ? 'None (Clean Zone)' : `${report.analysis.severity} Severity`}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Category</span>
                  <span className="font-bold text-slate-800">{report.analysis.category}</span>
                </div>

                <div className="bg-white p-2 rounded-lg border border-emerald-100">
                  <span className="text-[10px] text-slate-400 block font-semibold">Drainage Threat</span>
                  <span className="font-bold text-sky-800">{report.analysis.drainageRisk}</span>
                </div>

                <div className="bg-white p-2 rounded-lg border border-emerald-100 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block font-semibold">Pest Threat</span>
                  <span className="font-bold text-amber-800">{report.analysis.pestRisk}</span>
                </div>
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <div><strong>Assigned Clean Action:</strong> {report.analysis.recommendedAction}</div>
                <div><strong>Habit Advice:</strong> {report.analysis.responsibleAdvice}</div>
              </div>
            </div>
          )}

          {/* Assigned Municipal Team info */}
          {report.assignedTeam && (
            <div className="text-xs text-slate-600 p-3 bg-slate-100 rounded-xl">
              <strong>Assigned Clean Route:</strong> {report.assignedTeam}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {report.verifiedCount} Citizen Verifications
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onVerify(report.id)}
              disabled={report.userHasVerified}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                report.userHasVerified
                  ? 'bg-emerald-100 text-emerald-800 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{report.userHasVerified ? 'Verified by You' : 'Verify this Spot (+20 Pts)'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
