import React from 'react';
import { 
  Users, 
  Flame, 
  CheckCircle2, 
  Award, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ArrowRight, 
  TrendingUp,
  Share2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { CommunityChallenge, WasteReport, UserProfile } from '../types';
import { fireEcoConfetti } from '../utils/confetti';
import { CLEANED_COMMUNITY_PLACEHOLDER } from '../data/placeholderImages';

interface CommunityViewProps {
  challenges: CommunityChallenge[];
  reports: WasteReport[];
  user: UserProfile;
  selectedArea: string;
  onJoinChallenge: (challengeId: string) => void;
  onOpenReportDetail: (report: WasteReport) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  challenges,
  reports,
  user,
  selectedArea,
  onJoinChallenge,
  onOpenReportDetail,
}) => {
  const resolvedReports = reports.filter(r => r.status === 'Resolved');

  return (
    <div className="space-y-8">
      {/* Community Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Apollo University & Surrounding Community Pilot</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.2 rounded border border-amber-400/30">
              Prototype • Demo Data
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Cleanliness through Community Collaboration
          </h2>

          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Demonstrating how students and residents collaborate on daily habits. 
            All statistics, challenge milestones, and verification workflows shown here are simulated prototype data.
          </p>
        </div>

        {/* 4 Collaborative Hero Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <span className="text-xs text-slate-300 block">Demo Citizens</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-1 block">231 Total</span>
            <span className="text-[11px] text-emerald-300">Apollo: 142 • Surrounding: 89</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <span className="text-xs text-slate-300 block">Community Streak</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 mt-1 block">12 Days</span>
            <span className="text-[11px] text-amber-200">Prototype demo streak</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <span className="text-xs text-slate-300 block">Resolved Hotspots</span>
            <span className="text-xl sm:text-2xl font-black text-teal-300 mt-1 block">92 Spots</span>
            <span className="text-[11px] text-teal-200">Simulated resolutions</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/10">
            <span className="text-xs text-slate-300 block">Drainage Protected</span>
            <span className="text-xl sm:text-2xl font-black text-sky-300 mt-1 block">3.8 km</span>
            <span className="text-[11px] text-sky-200">Simulated clear flow</span>
          </div>
        </div>
      </div>

      {/* Community Cleanliness Challenges */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Active Community Cleanliness Challenges</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulated missions for Apollo University campus peers & surrounding community residents.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200 uppercase">
              Prototype • Demo Data
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {challenges.map((challenge) => {
            const percentage = Math.min(100, Math.round((challenge.currentCount / challenge.targetCount) * 100));

            return (
              <div 
                key={challenge.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                      {challenge.category}
                    </span>
                    <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{challenge.daysRemaining} days left</span>
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">{challenge.title}</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{challenge.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Progress: {challenge.currentCount} / {challenge.targetCount} {challenge.unit}</span>
                    <span className="text-emerald-700">{percentage}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${percentage}%` }}
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>{challenge.participantsCount} Citizens Joined</span>
                    </span>
                    <span className="font-bold text-amber-600">+{challenge.rewardPoints} Pts Reward</span>
                  </div>

                  <button
                    onClick={() => {
                      onJoinChallenge(challenge.id);
                      fireEcoConfetti();
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                      challenge.isJoined 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {challenge.isJoined ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Joined Mission</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Join Collaborative Challenge</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resolved Spot Showcase / Peer Verification */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Resolved Spot Showcase & Verification</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Before & after transparency demonstration. Citizens peer-verify that spots stay clean and zero-litter.
            </p>
          </div>
          <span className="text-xs text-amber-900 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            Simulated Prototype Workflow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resolvedReports.map((report) => (
            <div 
              key={report.id} 
              className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/20 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900 line-clamp-1">{report.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                  Resolved & Cleared
                </span>
              </div>

              {/* Before and After Image Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <img 
                    src={report.imageUrl} 
                    alt="Before cleaning" 
                    className="w-full h-28 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-slate-900/80 text-white text-[9px] font-bold rounded">
                    BEFORE
                  </span>
                </div>

                <div className="relative rounded-lg overflow-hidden border border-emerald-300 bg-emerald-100">
                  <img 
                    src={report.resolvedImageUrl || CLEANED_COMMUNITY_PLACEHOLDER} 
                    alt="After cleaning" 
                    className="w-full h-28 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-emerald-700/90 text-white text-[9px] font-bold rounded">
                    AFTER (CLEANED)
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{report.description}</p>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{report.location}</span>
                </span>

                <button
                  onClick={() => onOpenReportDetail(report)}
                  className="font-semibold text-emerald-700 hover:text-emerald-800 text-xs flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
