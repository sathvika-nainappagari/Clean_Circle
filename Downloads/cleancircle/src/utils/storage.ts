import { UserProfile, WasteReport, CommunityChallenge, BulkCollectionRequest } from '../types';
import { INITIAL_USER, INITIAL_REPORTS, INITIAL_CHALLENGES, INITIAL_BULK_REQUESTS } from '../data/mockData';
import { CLEANED_COMMUNITY_PLACEHOLDER } from '../data/placeholderImages';

const USER_KEY = 'cleancircle_user_v4';
const REPORTS_KEY = 'cleancircle_reports_v4';
const CHALLENGES_KEY = 'cleancircle_challenges_v4';
const BULK_KEY = 'cleancircle_bulk_v4';

const CLEANED_ROAD_IMAGE = CLEANED_COMMUNITY_PLACEHOLDER;

export function getStoredUser(): UserProfile {
  try {
    const data = localStorage.getItem(USER_KEY) || localStorage.getItem('cleancircle_user_v3') || localStorage.getItem('cleancircle_user_v1');
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
  }
  return INITIAL_USER;
}

export function saveStoredUser(user: UserProfile): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user to localStorage', e);
  }
}

export function getStoredReports(): WasteReport[] {
  try {
    const data = localStorage.getItem(REPORTS_KEY) || localStorage.getItem('cleancircle_reports_v3') || localStorage.getItem('cleancircle_reports_v2') || localStorage.getItem('cleancircle_reports_v1');
    if (data) {
      const parsed: WasteReport[] = JSON.parse(data);
      // Auto-sanitize any legacy beach or skyscraper images from older session cache to local community placeholder
      return parsed.map((report) => {
        let updated = { ...report };
        if (updated.resolvedImageUrl && (
          updated.resolvedImageUrl.includes('photo-1507525428034') || 
          updated.resolvedImageUrl.includes('photo-1519501025264') ||
          updated.resolvedImageUrl.includes('photo-1596176530529')
        )) {
          updated.resolvedImageUrl = CLEANED_ROAD_IMAGE;
        }
        if (updated.imageUrl && (
          updated.imageUrl.includes('photo-1507525428034') || 
          updated.imageUrl.includes('photo-1519501025264') ||
          updated.imageUrl.includes('photo-1596176530529')
        )) {
          updated.imageUrl = CLEANED_ROAD_IMAGE;
        }
        return updated;
      });
    }
  } catch (e) {
    console.error('Failed to parse reports', e);
  }
  return INITIAL_REPORTS;
}

export function saveStoredReports(reports: WasteReport[]): void {
  try {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  } catch (e) {
    console.error('Failed to save reports', e);
  }
}

export function getStoredChallenges(): CommunityChallenge[] {
  try {
    const data = localStorage.getItem(CHALLENGES_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse challenges', e);
  }
  return INITIAL_CHALLENGES;
}

export function saveStoredChallenges(challenges: CommunityChallenge[]): void {
  try {
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
  } catch (e) {
    console.error('Failed to save challenges', e);
  }
}

export function getStoredBulkRequests(): BulkCollectionRequest[] {
  try {
    const data = localStorage.getItem(BULK_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse bulk requests', e);
  }
  return INITIAL_BULK_REQUESTS;
}

export function saveStoredBulkRequests(reqs: BulkCollectionRequest[]): void {
  try {
    localStorage.setItem(BULK_KEY, JSON.stringify(reqs));
  } catch (e) {
    console.error('Failed to save bulk requests', e);
  }
}

export function recalculateLevel(points: number): UserProfile['level'] {
  if (points >= 800) return 'Community Champion';
  if (points >= 400) return 'Green Guardian';
  if (points >= 150) return 'Eco Contributor';
  return 'New Contributor';
}
