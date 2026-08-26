export type ContributorLevel = 'New Contributor' | 'Eco Contributor' | 'Green Guardian' | 'Community Champion';

export type ReportStatus = 'Reported' | 'Assigned' | 'Cleaning in Progress' | 'Resolved';

export type WasteCategory = 
  | 'Plastic Waste' 
  | 'Mixed Municipal Dump' 
  | 'Organic / Food Waste' 
  | 'Construction & Demolition' 
  | 'Hazardous / E-Waste' 
  | 'Bulky Waste' 
  | 'Drainage Clog Waste';

export interface AIAnalysisResult {
  category: string;
  severity: 'None' | 'Low' | 'Moderate' | 'High' | 'Critical';
  estimatedVolume: string;
  wasteComposition: string[];
  drainageRisk: string;
  pestRisk: string;
  recommendedAction: string;
  responsibleAdvice: string;
  ecoPointsReward: number;
  isCleanOrNoIssue?: boolean;
  visualEvidenceSummary?: string;
}

export interface WasteReport {
  id: string;
  title: string;
  location: string;
  areaName: string;
  description: string;
  imageUrl: string;
  reportedAt: string;
  reportedBy: string;
  status: ReportStatus;
  analysis: AIAnalysisResult;
  verifiedCount: number;
  userHasVerified?: boolean;
  assignedTeam?: string;
  resolvedAt?: string;
  resolvedImageUrl?: string;
  commentsCount: number;
}

export interface BulkCollectionRequest {
  id: string;
  itemType: string;
  approxWeightOrCount: string;
  pickupAddress: string;
  area: string;
  preferredDate: string;
  preferredSlot: 'Morning (7 AM - 10 AM)' | 'Afternoon (1 PM - 4 PM)' | 'Evening (5 PM - 7 PM)';
  notes: string;
  status: 'Requested' | 'Scheduled' | 'Collected';
  submittedAt: string;
  ecoPointsEarned: number;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  unit: string;
  daysRemaining: number;
  area: string;
  participantsCount: number;
  rewardPoints: number;
  isJoined?: boolean;
  category: 'Segregation' | 'Reporting' | 'Zero-Litter' | 'Drain Clearance';
}

export interface UserProfile {
  name: string;
  phone: string;
  neighborhood: string;
  city: string;
  streakDays: number;
  lastActiveDate: string;
  ecoPoints: number;
  level: ContributorLevel;
  isVerifiedBadgeHolder: boolean;
  verificationProgress: {
    reportsCount: number;
    requiredReports: number;
    segregationStreak: number;
    requiredStreak: number;
    verificationsCount: number;
    requiredVerifications: number;
  };
  actionsHistory: UserActionItem[];
}

export interface UserActionItem {
  id: string;
  title: string;
  category: 'Report' | 'Segregation' | 'Verification' | 'Bulk Collection' | 'Daily Habit' | 'Challenge';
  points: number;
  timestamp: string;
  details: string;
  iconName: string;
}

export interface WasteDisposalCategory {
  id: string;
  title: string;
  colorName: string;
  binColor: string;
  icon: string;
  items: string[];
  doList: string[];
  dontList: string[];
  schedule: string;
  impactFact: string;
}
