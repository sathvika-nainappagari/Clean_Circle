import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  WasteReport, 
  CommunityChallenge, 
  BulkCollectionRequest,
  UserActionItem 
} from './types';
import { 
  getStoredUser, 
  saveStoredUser, 
  getStoredReports, 
  saveStoredReports, 
  getStoredChallenges, 
  saveStoredChallenges, 
  getStoredBulkRequests, 
  saveStoredBulkRequests,
  recalculateLevel 
} from './utils/storage';
import { INITIAL_USER, INITIAL_REPORTS, INITIAL_CHALLENGES, INITIAL_BULK_REQUESTS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { StreakHero } from './components/StreakHero';
import { CommunityCleanlinessMeter } from './components/CommunityCleanlinessMeter';
import { DailyHabitChecklist } from './components/DailyHabitChecklist';
import { ReportWasteView } from './components/ReportWasteView';
import { ProperDisposalView } from './components/ProperDisposalView';
import { CommunityView } from './components/CommunityView';
import { ImpactView } from './components/ImpactView';
import { ProfileView } from './components/ProfileView';
import { BulkRequestModal } from './components/BulkRequestModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { fireEcoConfetti, fireBigCelebration } from './utils/confetti';
import { 
  Sparkles, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  Recycle,
  Building2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedArea, setSelectedArea] = useState<string>('All Pilot Areas');

  // Core Persistent State
  const [user, setUser] = useState<UserProfile>(() => getStoredUser());
  const [reports, setReports] = useState<WasteReport[]>(() => getStoredReports());
  const [challenges, setChallenges] = useState<CommunityChallenge[]>(() => getStoredChallenges());
  const [bulkRequests, setBulkRequests] = useState<BulkCollectionRequest[]>(() => getStoredBulkRequests());

  // Modal States
  const [isBulkModalOpen, setIsBulkModalOpen] = useState<boolean>(false);
  const [selectedReportDetail, setSelectedReportDetail] = useState<WasteReport | null>(null);

  // Sync to LocalStorage on changes
  useEffect(() => {
    saveStoredUser(user);
  }, [user]);

  useEffect(() => {
    saveStoredReports(reports);
  }, [reports]);

  useEffect(() => {
    saveStoredChallenges(challenges);
  }, [challenges]);

  useEffect(() => {
    saveStoredBulkRequests(bulkRequests);
  }, [bulkRequests]);

  // Handler: Add New Report
  const handleAddReport = (newReport: WasteReport) => {
    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);

    const pointsEarned = newReport.analysis?.ecoPointsReward || 35;
    const newTotalPoints = user.ecoPoints + pointsEarned;
    const newLevel = recalculateLevel(newTotalPoints);

    const newAction: UserActionItem = {
      id: `act-rep-${Date.now()}`,
      title: 'Reported Roadside Dumping Spot',
      category: 'Report',
      points: pointsEarned,
      timestamp: 'Just now',
      details: `${newReport.title} at ${newReport.location}`,
      iconName: 'AlertTriangle',
    };

    const updatedUser: UserProfile = {
      ...user,
      ecoPoints: newTotalPoints,
      level: newLevel,
      verificationProgress: {
        ...user.verificationProgress,
        reportsCount: user.verificationProgress.reportsCount + 1,
      },
      actionsHistory: [newAction, ...user.actionsHistory],
    };

    setUser(updatedUser);
  };

  // Handler: Verify a Cleaned / Reported Spot
  const handleVerifyReport = (reportId: string) => {
    const target = reports.find(r => r.id === reportId);
    if (!target || target.userHasVerified) return;

    const updatedReports = reports.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          verifiedCount: r.verifiedCount + 1,
          userHasVerified: true,
        };
      }
      return r;
    });

    setReports(updatedReports);
    fireEcoConfetti();

    const pointsEarned = 20;
    const newTotalPoints = user.ecoPoints + pointsEarned;
    const newLevel = recalculateLevel(newTotalPoints);

    const newAction: UserActionItem = {
      id: `act-ver-${Date.now()}`,
      title: 'Verified Cleaned Spot',
      category: 'Verification',
      points: pointsEarned,
      timestamp: 'Just now',
      details: `Peer-verified spot: ${target.title}`,
      iconName: 'CheckCircle2',
    };

    const updatedUser: UserProfile = {
      ...user,
      ecoPoints: newTotalPoints,
      level: newLevel,
      verificationProgress: {
        ...user.verificationProgress,
        verificationsCount: user.verificationProgress.verificationsCount + 1,
      },
      actionsHistory: [newAction, ...user.actionsHistory],
    };

    setUser(updatedUser);

    if (selectedReportDetail && selectedReportDetail.id === reportId) {
      setSelectedReportDetail({
        ...selectedReportDetail,
        verifiedCount: selectedReportDetail.verifiedCount + 1,
        userHasVerified: true,
      });
    }
  };

  // Handler: Join Collaborative Challenge
  const handleJoinChallenge = (challengeId: string) => {
    const updated = challenges.map(ch => {
      if (ch.id === challengeId) {
        const isNowJoined = !ch.isJoined;
        return {
          ...ch,
          isJoined: isNowJoined,
          participantsCount: isNowJoined ? ch.participantsCount + 1 : ch.participantsCount - 1,
          currentCount: isNowJoined ? ch.currentCount + 1 : ch.currentCount,
        };
      }
      return ch;
    });

    setChallenges(updated);

    const chTarget = challenges.find(c => c.id === challengeId);
    if (chTarget && !chTarget.isJoined) {
      const newAction: UserActionItem = {
        id: `act-ch-${Date.now()}`,
        title: `Joined Challenge: ${chTarget.title}`,
        category: 'Challenge',
        points: 25,
        timestamp: 'Just now',
        details: `Participating in community cleanliness mission in ${chTarget.area}`,
        iconName: 'Award',
      };

      const newTotalPoints = user.ecoPoints + 25;
      setUser({
        ...user,
        ecoPoints: newTotalPoints,
        level: recalculateLevel(newTotalPoints),
        actionsHistory: [newAction, ...user.actionsHistory],
      });
    }
  };

  // Handler: Submit Bulk Collection Request
  const handleAddBulkRequest = (newReq: BulkCollectionRequest) => {
    setBulkRequests([newReq, ...bulkRequests]);

    const newTotalPoints = user.ecoPoints + newReq.ecoPointsEarned;
    const newAction: UserActionItem = {
      id: `act-bulk-${Date.now()}`,
      title: 'Scheduled Doorstep Bulk Collection',
      category: 'Bulk Collection',
      points: newReq.ecoPointsEarned,
      timestamp: 'Just now',
      details: `${newReq.itemType} (${newReq.approxWeightOrCount})`,
      iconName: 'Truck',
    };

    setUser({
      ...user,
      ecoPoints: newTotalPoints,
      level: recalculateLevel(newTotalPoints),
      actionsHistory: [newAction, ...user.actionsHistory],
    });
  };

  // Handler: Reset Demo Data
  const handleResetData = () => {
    localStorage.clear();
    setUser(INITIAL_USER);
    setReports(INITIAL_REPORTS);
    setChallenges(INITIAL_CHALLENGES);
    setBulkRequests(INITIAL_BULK_REQUESTS);
    fireEcoConfetti();
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans antialiased pb-24 md:pb-0">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
        onOpenReportModal={() => setActiveTab('report')}
        onOpenBulkModal={() => setIsBulkModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab 1: Home / Dashboard */}
        {activeTab === 'home' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <StreakHero
              user={user}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenReportModal={() => setActiveTab('report')}
              onOpenBulkModal={() => setIsBulkModalOpen(true)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Cleanliness Meter & Quick Hotspots */}
              <div className="lg:col-span-7 space-y-6">
                <CommunityCleanlinessMeter
                  reports={reports}
                  selectedArea={selectedArea}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />

                {/* Quick Community Clean Corridor Callout */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wide">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>Apollo University & Surrounding Community Pilot</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">Apollo University Clean Corridor Challenge</h3>
                    <p className="text-xs text-slate-500">
                      38 out of 50 student & resident spot checks verified. Join this active challenge!
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('community')}
                    className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs shrink-0 transition"
                  >
                    View Community Missions →
                  </button>
                </div>
              </div>

              {/* Right Column: Daily Habits & Quick Guides */}
              <div className="lg:col-span-5 space-y-6">
                <DailyHabitChecklist
                  user={user}
                  onUpdateUser={(u) => setUser(u)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Report Waste */}
        {activeTab === 'report' && (
          <div className="animate-in fade-in duration-300">
            <ReportWasteView
              reports={reports}
              user={user}
              selectedArea={selectedArea}
              onAddReport={handleAddReport}
              onVerifyReport={handleVerifyReport}
              onOpenReportDetail={(r) => setSelectedReportDetail(r)}
            />
          </div>
        )}

        {/* Tab 3: Proper Disposal */}
        {activeTab === 'disposal' && (
          <div className="animate-in fade-in duration-300">
            <ProperDisposalView
              bulkRequests={bulkRequests}
              onOpenBulkModal={() => setIsBulkModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 4: Community */}
        {activeTab === 'community' && (
          <div className="animate-in fade-in duration-300">
            <CommunityView
              challenges={challenges}
              reports={reports}
              user={user}
              selectedArea={selectedArea}
              onJoinChallenge={handleJoinChallenge}
              onOpenReportDetail={(r) => setSelectedReportDetail(r)}
            />
          </div>
        )}

        {/* Tab 5: Civic Impact */}
        {activeTab === 'impact' && (
          <div className="animate-in fade-in duration-300">
            <ImpactView />
          </div>
        )}

        {/* Tab 6: Profile & Badges */}
        {activeTab === 'profile' && (
          <div className="animate-in fade-in duration-300">
            <ProfileView
              user={user}
              onUpdateUser={(u) => setUser(u)}
              onResetData={handleResetData}
            />
          </div>
        )}
      </main>

      {/* Clean Modern Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Prominent Demo Disclaimer Banner */}
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 mb-8 text-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-bold uppercase text-[10px] rounded shrink-0">
              Disclaimer
            </span>
            <p className="text-xs leading-relaxed text-amber-200/90">
              <strong>Demo Data</strong> — This prototype uses simulated data and workflows for demonstration purposes. The statistics, community members, Eco Points, streaks, reports, and municipal workflows are not real-world deployment data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Recycle className="w-4 h-4" />
                </div>
                <span>CleanCircle — Prototype Demo</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-emerald-900 text-emerald-300 rounded">
                  Apollo Univ Pilot
                </span>
              </div>
              <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                Transforming civic awareness into daily responsible cleanliness habits. 
                Piloted in Apollo University campus & surrounding community, Chittoor, Andhra Pradesh.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2.5">Responsible Civic Flow</h4>
              <ul className="space-y-1.5 text-slate-400 text-xs">
                <li>• Household 2-Bin Source Segregation</li>
                <li>• AI Waste & Drainage Hazard Inspection</li>
                <li>• On-Demand Bulky Waste Pickup</li>
                <li>• Spot Verification & Peer Trust</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2.5">Pilot Location</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Apollo University Campus & Surrounding Community.<br />
                Chittoor Municipal Area, Andhra Pradesh 517001.<br />
                Designed for grassroots scalability across Indian institutions & towns.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>© 2026 CleanCircle — Prototype Demo. Built for sustainable everyday habit change.</span>
            <div className="flex items-center gap-1 text-amber-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Simulated Prototype Demonstration</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BulkRequestModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        user={user}
        selectedArea={selectedArea}
        onSubmitRequest={handleAddBulkRequest}
      />

      <ReportDetailModal
        report={selectedReportDetail}
        onClose={() => setSelectedReportDetail(null)}
        onVerify={handleVerifyReport}
      />
    </div>
  );
}
