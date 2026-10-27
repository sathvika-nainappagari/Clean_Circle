```tsx
import React, { useState } from 'react';
import {
  Camera,
  Upload,
  MapPin,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Coins,
  Eye,
  Check,
  Info,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { WasteReport, UserProfile, AIAnalysisResult } from '../types';
import { CHITTOOR_AREAS } from '../data/mockData';
import { fireBigCelebration, fireEcoConfetti } from '../utils/confetti';
import { CLEANED_COMMUNITY_PLACEHOLDER } from '../data/placeholderImages';

interface ReportWasteViewProps {
  reports: WasteReport[];
  user: UserProfile;
  selectedArea: string;
  onAddReport: (newReport: WasteReport) => void;
  onVerifyReport: (reportId: string) => void;
  onOpenReportDetail: (report: WasteReport) => void;
}

const SAMPLE_PRESETS = [
  {
    name: 'Roadside Garbage Hotspot',
    categoryLabel: 'Roadside Garbage / Dumping',
    tag: 'Hotspot',
    area: 'Apollo University Campus & Surrounding Community',
    location: 'Apollo University Campus Approach Road, Chittoor',
    desc: 'Single-use plastic water bottles, snack packets, and roadside litter accumulated along curb.',
    img: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Mixed Household Waste',
    categoryLabel: 'Mixed Household Waste',
    tag: 'Mixed Litter',
    area: 'Murakambattu Residential Colony',
    location: 'Murakambattu 2nd Main Road Corner, Chittoor',
    desc: 'Unsegregated household garbage containing discarded plastic packaging, food containers, and cartons.',
    img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Waste Blocking Storm Drain',
    categoryLabel: 'Drain Blockage',
    tag: 'Drain Hazard',
    area: 'Apollo University Campus & Surrounding Community',
    location: 'Campus South Perimeter Storm Canal, Chittoor',
    desc: 'Plastic bottles, polythene, and silt obstructing storm drainage inlet; causing stagnant water risk.',
    img: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Cleaned Roadside Location',
    categoryLabel: 'Cleaned / Resolved Location',
    tag: 'Clean Verified',
    area: 'Apollo University Campus & Surrounding Community',
    location: 'Apollo University Paved Walkway, Chittoor',
    desc: 'Clean paved public corridor with zero litter, clear drainage, and maintained surroundings.',
    img: CLEANED_COMMUNITY_PLACEHOLDER,
  },
  {
    name: 'Organic & Market Greens',
    categoryLabel: 'Organic / Green Waste',
    tag: 'Organic Waste',
    area: 'Gandhi Road & Market Junction',
    location: 'Gandhi Road Vegetable Market Corner, Chittoor',
    desc: 'Rotting vegetable greens, fruit peels, and coconut husks dumped in open curb.',
    img: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Electronic Waste (E-Waste)',
    categoryLabel: 'E-Waste',
    tag: 'E-Waste',
    area: 'Apollo University Campus & Surrounding Community',
    location: 'Hostel Block E-Waste Drop-off Point, Chittoor',
    desc: 'Damaged power adapters, discarded USB cables, and broken electronic components.',
    img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bulky Furniture & Debris',
    categoryLabel: 'Bulky Waste',
    tag: 'Bulky Waste',
    area: 'Kongareddy Palli Main Road',
    location: 'Kongareddy Palli Water Tank Road, Chittoor',
    desc: 'Discarded old wooden furniture parts and worn mattress left beside vacant lot.',
    img: 'https://images.unsplash.com/photo-1528190336454-13cd56b45b5a?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Segregated Household Waste',
    categoryLabel: 'Segregated Bins',
    tag: 'Segregated',
    area: 'Murakambattu Residential Colony',
    location: 'Murakambattu Model Green Household, Chittoor',
    desc: 'Properly segregated dry recyclable packaging and wet compostable kitchen bins.',
    img: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=800&q=80',
  },
];

const createFallbackAnalysis = (offline = false): AIAnalysisResult => ({
  category: 'Unable to confidently identify',
  severity: 'Low',
  estimatedVolume: 'Uncertain',
  wasteComposition: [],
  drainageRisk: offline
    ? 'Unable to determine (Offline)'
    : 'Unable to determine from current photo',
  pestRisk: offline
    ? 'Unable to determine (Offline)'
    : 'Unable to determine from current photo',
  recommendedAction: offline
    ? 'Connection error during inspection. Please try again.'
    : 'Unable to confidently analyze image. Please ensure photo is well-lit and clear.',
  responsibleAdvice:
    'Clear photos ensure sanitation teams accurately locate civic hotspots.',
  ecoPointsReward: 10,
  isCleanOrNoIssue: false,
  visualEvidenceSummary: offline
    ? 'Network error occurred while connecting to AI inspection service.'
    : 'Image analysis could not be completed.',
});

export const ReportWasteView: React.FC<ReportWasteViewProps> = ({
  reports,
  user,
  selectedArea,
  onAddReport,
  onVerifyReport,
  onOpenReportDetail,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string>(SAMPLE_PRESETS[0].img);
  const [areaName, setAreaName] = useState<string>(CHITTOOR_AREAS[0]);
  const [locationText, setLocationText] = useState<string>(
    'Near Apollo University Campus Approach Road'
  );
  const [description, setDescription] = useState<string>(
    'Roadside plastic litter and polythene bags choking the storm drainage inlet.'
  );

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);

  // Handle photo uploads.
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedPhoto(reader.result);
        setAiResult(null);
      }
    };

    reader.onerror = () => {
      alert('Unable to read this image. Please try another file.');
    };

    reader.readAsDataURL(file);
  };

  // Run AI inspection analysis.
  const handleRunAIAnalysis = async () => {
    if (!selectedPhoto || isAnalyzing) return;

    setIsAnalyzing(true);
    setAiResult(null);

    try {
      const isSvg = selectedPhoto.startsWith('data:image/svg+xml');
      const isDataUrl = selectedPhoto.startsWith('data:image/');
      const isRemoteUrl = /^https?:\/\//i.test(selectedPhoto);

      // Separate image URLs from uploaded image data.
      // SVG is sent separately so the backend can convert it to PNG.
      const requestBody = {
        imageBase64: isSvg || isRemoteUrl ? '' : selectedPhoto,
        imageUrl: isRemoteUrl ? selectedPhoto : '',
        svgDataUrl: isSvg ? selectedPhoto : '',
        mimeType: isSvg
          ? 'image/svg+xml'
          : isDataUrl
            ? selectedPhoto.slice(5, selectedPhoto.indexOf(';'))
            : 'image/jpeg',
        location: `${locationText}, ${areaName}`,
        description,
      };

      const response = await fetch('/api/analyze-waste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error('AI analysis API error:', data.error || response.statusText);
        setAiResult(createFallbackAnalysis());
        return;
      }

      if (data.analysis) {
        setAiResult(data.analysis);
        fireEcoConfetti();
      } else {
        console.error('API response did not contain an analysis:', data);
        setAiResult(createFallbackAnalysis());
      }
    } catch (error) {
      console.warn('API call error:', error);
      setAiResult(createFallbackAnalysis(true));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit the final civic report.
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPhoto || !locationText.trim()) return;

    const analysisToUse: AIAnalysisResult = aiResult || {
      category: 'Civic Spot Check',
      severity: 'Low',
      estimatedVolume: '1-2 items',
      wasteComposition: ['Mixed items'],
      drainageRisk: 'No visible drainage hazard in view',
      pestRisk: 'Low',
      recommendedAction: 'Assigned to Chittoor Ward Clean Route',
      responsibleAdvice: 'Daily segregation prevents overflow.',
      ecoPointsReward: 25,
      isCleanOrNoIssue: false,
    };

    const isClean =
      analysisToUse.isCleanOrNoIssue ||
      analysisToUse.category === 'No Issue Detected';

    const newReport: WasteReport = {
      id: `rep-${Date.now()}`,
      title: isClean
        ? `Clean Area Verified at ${locationText.split(',')[0]}`
        : `${analysisToUse.category} Spot at ${locationText.split(',')[0]}`,
      location: locationText,
      areaName,
      description:
        description ||
        (isClean
          ? 'Verified clean neighborhood area.'
          : 'Roadside dump reported by citizen for civic cleanup.'),
      imageUrl: selectedPhoto,
      reportedAt: 'Just now',
      reportedBy: `${user.name} (Citizen)`,
      status: isClean ? 'Resolved' : 'Reported',
      analysis: analysisToUse,
      verifiedCount: 1,
      userHasVerified: true,
      commentsCount: 0,
    };

    onAddReport(newReport);
    fireBigCelebration();
    setShowSuccessBanner(true);

    setDescription('');
    setAiResult(null);

    setTimeout(() => {
      setShowSuccessBanner(false);
    }, 6000);
  };

  const filteredReports = reports.filter((report) => {
    const matchesArea =
      selectedArea === 'All Pilot Areas' || report.areaName === selectedArea;
    const matchesStatus =
      statusFilter === 'All' || report.status === statusFilter;

    return matchesArea && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-semibold">
              <Camera className="w-3.5 h-3.5" />
              <span>AI-Assisted Civic Reporting</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded">
              Prototype • Demo Data
            </span>
          </div>

          <h2 className="text-2xl font-black tracking-tight">
            Report Roadside Dumping &amp; Waste Hotspots
          </h2>

          <p className="text-sm text-emerald-100 mt-1 max-w-2xl">
            Demonstrating how AI analyzes waste category, composition, and
            drainage hazard to dispatch reports. Note: Workflows and municipal
            dispatches in this prototype are simulated demonstrations.
          </p>
        </div>

        <div className="bg-emerald-900/60 border border-emerald-600/40 rounded-xl p-3.5 shrink-0 flex items-center gap-3">
          <Coins className="w-6 h-6 text-amber-400" />
          <div>
            <div className="text-xs text-emerald-200">Demo Civic Reward</div>
            <div className="text-sm font-bold text-white">+35 Eco Points / Report</div>
          </div>
        </div>
      </div>

      {showSuccessBanner && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <p className="text-sm font-bold">
                Civic Report Logged Successfully! (Simulated Workflow)
              </p>
              <p className="text-xs text-emerald-700">
                Prototype demonstration: In a live deployment, this report is
                dispatched to the ward team. +35 Eco Points credited to demo
                profile.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSuccessBanner(false)}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Camera className="w-5 h-5 text-emerald-600" />
              <span>Step 1: Upload or Choose Photo</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Select a sample hotspot or upload custom photo:</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SAMPLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedPhoto(preset.img);
                      setAreaName(preset.area);
                      setLocationText(preset.location);
                      setDescription(preset.desc);
                      setAiResult(null);
                    }}
                    className={`p-2 rounded-xl border text-left text-xs transition flex flex-col gap-1.5 relative group ${
                      selectedPhoto === preset.img
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative w-full h-16 rounded-lg overflow-hidden bg-slate-100">
                      <img
                        src={preset.img}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                      />

                      <span
                        className={`absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs ${
                          preset.tag === 'Clean Verified'
                            ? 'bg-emerald-700 text-white'
                            : preset.tag === 'Drain Hazard'
                              ? 'bg-sky-700 text-white'
                              : preset.tag === 'Organic Waste'
                                ? 'bg-lime-700 text-white'
                                : preset.tag === 'E-Waste'
                                  ? 'bg-purple-700 text-white'
                                  : preset.tag === 'Bulky Waste'
                                    ? 'bg-amber-700 text-white'
                                    : preset.tag === 'Segregated'
                                      ? 'bg-teal-700 text-white'
                                      : 'bg-slate-900/80 text-white'
                        }`}
                      >
                        {preset.tag}
                      </span>
                    </div>

                    <span className="font-bold text-slate-800 text-[11px] leading-tight line-clamp-1">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-2 flex items-center gap-3">
                <label className="flex-1 cursor-pointer border border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 rounded-xl p-3 text-center transition flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Upload from Device / Take Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="relative mt-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group">
                <img
                  src={selectedPhoto}
                  alt="Waste to inspect"
                  className="w-full h-56 object-cover opacity-90"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                  <button
                    type="button"
                    onClick={handleRunAIAnalysis}
                    disabled={isAnalyzing}
                    className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition active:scale-98"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                        <span>AI Inspecting Pixels for Visible Evidence...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {aiResult
                            ? 'Re-Analyze with Evidence AI'
                            : 'Run Evidence-Based AI Inspection'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {aiResult && (
              <div
                className={`mt-5 p-4 rounded-xl border space-y-3 animate-in fade-in ${
                  aiResult.isCleanOrNoIssue ||
                  aiResult.category === 'No Issue Detected'
                    ? 'bg-emerald-50/90 border-emerald-300 text-slate-900'
                    : aiResult.category === 'Unable to confidently identify'
                      ? 'bg-amber-50/90 border-amber-300 text-slate-900'
                      : 'bg-emerald-50/70 border-emerald-200 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
                  <div className="flex items-center gap-2">
                    {aiResult.isCleanOrNoIssue ||
                    aiResult.category === 'No Issue Detected' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : aiResult.category === 'Unable to confidently identify' ? (
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                    )}

                    <span className="font-bold text-sm text-emerald-950">
                      {aiResult.isCleanOrNoIssue ||
                      aiResult.category === 'No Issue Detected'
                        ? 'Clean Area Verified — No Issue Detected'
                        : aiResult.category === 'Unable to confidently identify'
                          ? 'Inspection Notice — Unable to Confidently Identify'
                          : 'CleanCircle AI Evidence Analysis'}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                    +{aiResult.ecoPointsReward} Eco Points
                  </span>
                </div>

                {(aiResult.isCleanOrNoIssue ||
                  aiResult.category === 'No Issue Detected') && (
                  <div className="p-3 bg-white/90 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>No Environmental Hazard or Waste Found</span>
                    </div>
                    <p className="text-slate-700">
                      No report is necessary. The AI verified that this area is
                      clean with no visible waste accumulation, dump pile, or
                      drainage blockage.
                    </p>
                  </div>
                )}

                {aiResult.category === 'Unable to confidently identify' && (
                  <div className="p-3 bg-white/90 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Photo Insufficient to Determine Waste</span>
                    </div>
                    <p className="text-slate-700">
                      Rather than guessing, CleanCircle requires a clearer,
                      well-lit photograph. If an issue exists, retake a closer
                      shot.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      Detected Category
                    </span>
                    <span className="font-bold text-slate-900">
                      {aiResult.category}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-emerald-100">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      Severity Level
                    </span>
                    <span
                      className={`font-bold ${
                        aiResult.severity === 'Critical'
                          ? 'text-rose-600'
                          : aiResult.severity === 'High'
                            ? 'text-amber-600'
                            : aiResult.severity === 'Moderate'
                              ? 'text-yellow-600'
                              : 'text-emerald-700'
                      }`}
                    >
                      {aiResult.severity === 'None'
                        ? 'None (Clean)'
                        : aiResult.severity}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-emerald-100 col-span-2 sm:col-span-1">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      Est. Volume
                    </span>
                    <span className="font-bold text-slate-900">
                      {aiResult.estimatedVolume}
                    </span>
                  </div>
                </div>

                {aiResult.wasteComposition &&
                  aiResult.wasteComposition.length > 0 && (
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-100 text-xs">
                      <span className="text-slate-500 block text-[10px] uppercase font-semibold mb-1">
                        Visibly Supported Items
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {aiResult.wasteComposition.map((item, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {aiResult.visualEvidenceSummary && (
                  <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-100 text-xs text-slate-700">
                    <strong className="text-slate-900 block text-[10px] uppercase font-semibold mb-0.5">
                      Visual Evidence:
                    </strong>
                    <span>{aiResult.visualEvidenceSummary}</span>
                  </div>
                )}

                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex items-start gap-2 text-slate-700">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Drainage Risk:</strong>{' '}
                      {aiResult.drainageRisk}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-700">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Pest Hazard:</strong>{' '}
                      {aiResult.pestRisk}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-emerald-800 bg-white/80 p-2 rounded-lg border border-emerald-100">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-emerald-950">Civic Guidance:</strong>{' '}
                      {aiResult.responsibleAdvice}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmitReport}
              className="mt-6 space-y-4 pt-5 border-t border-slate-100"
            >
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Step 2: Location &amp; Neighborhood Details</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chittoor Pilot Area / Ward
                </label>
                <select
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CHITTOOR_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Street Landmark / Specific Spot
                </label>
                <input
                  type="text"
                  required
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="e.g., Opp. PVKN College Main Library, near tea shop"
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description &amp; Context (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Plastic bottles blocking the gutter; water pooling after rain."
                  className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-white font-bold rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="w-4 h-4" />
                <span>
                  {aiResult?.isCleanOrNoIssue ||
                  aiResult?.category === 'No Issue Detected'
                    ? 'Log Verified Clean Spot (+15 Points)'
                    : 'Submit Civic Report (+35 Points)'}
                </span>
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Report Lifecycle &amp; Resolution Flow</span>
            </h4>

            <div className="grid grid-cols-4 gap-1 text-center">
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-100">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block mb-1" />
                <div className="text-[10px] font-bold text-rose-800">1. Reported</div>
                <div className="text-[9px] text-slate-500">Citizen logged</div>
              </div>

              <div className="p-2 rounded-lg bg-amber-50 border border-amber-100">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mb-1" />
                <div className="text-[10px] font-bold text-amber-800">2. Assigned</div>
                <div className="text-[9px] text-slate-500">Ward vehicle</div>
              </div>

              <div className="p-2 rounded-lg bg-sky-50 border border-sky-100">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block mb-1" />
                <div className="text-[10px] font-bold text-sky-800">3. Cleaning</div>
                <div className="text-[9px] text-slate-500">In progress</div>
              </div>

              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mb-1" />
                <div className="text-[10px] font-bold text-emerald-800">4. Resolved</div>
                <div className="text-[9px] text-slate-500">Peer verified</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Chittoor Hotspots Feed</h4>
                <p className="text-xs text-slate-500">Active reports in pilot</p>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                {['All', 'Reported', 'Assigned', 'Resolved'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`px-2 py-0.5 rounded-md font-medium text-[11px] transition ${
                      statusFilter === status
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-3.5 rounded-xl border border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/20 transition space-y-2.5"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-100 cursor-pointer"
                      onClick={() => onOpenReportDetail(report)}
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            report.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : report.status === 'Cleaning in Progress'
                                ? 'bg-sky-100 text-sky-800'
                                : report.status === 'Assigned'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {report.status}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {report.reportedAt}
                        </span>
                      </div>

                      <h5
                        onClick={() => onOpenReportDetail(report)}
                        className="text-xs font-bold text-slate-900 mt-1 line-clamp-1 cursor-pointer hover:text-emerald-700"
                      >
                        {report.title}
                      </h5>

                      <p className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{report.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="text-[11px] text-slate-500">
                      <span>By {report.reportedBy}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onVerifyReport(report.id)}
                        disabled={report.userHasVerified}
                        className={`text-[11px] px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition ${
                          report.userHasVerified
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : 'bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {report.userHasVerified
                            ? 'Verified'
                            : `Verify (${report.verifiedCount})`}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenReportDetail(report)}
                        className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-0.5 p-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredReports.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No reports matching this filter in {selectedArea}.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```
