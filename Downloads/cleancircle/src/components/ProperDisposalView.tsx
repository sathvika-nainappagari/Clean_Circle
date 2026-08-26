import React, { useState } from 'react';
import { 
  Search, 
  Recycle, 
  Leaf, 
  Cpu, 
  ShieldAlert, 
  AlertTriangle,
  Truck, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Info, 
  Plus, 
  ArrowRight, 
  HelpCircle, 
  PackageCheck 
} from 'lucide-react';
import { DISPOSAL_CATEGORIES } from '../data/mockData';
import { WasteDisposalCategory, BulkCollectionRequest } from '../types';
import { fireEcoConfetti } from '../utils/confetti';

interface ProperDisposalViewProps {
  bulkRequests: BulkCollectionRequest[];
  onOpenBulkModal: () => void;
}

const COMMON_QUERIES = [
  'Coconut Shell',
  'Medicine Strip',
  'Milk Pouch',
  'Old Smartphone Charger',
  'Garden Leaves & Branches',
  'Broken Glass Bottle',
  'Used Battery',
  'Cardboard Delivery Box'
];

export const ProperDisposalView: React.FC<ProperDisposalViewProps> = ({
  bulkRequests,
  onOpenBulkModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<WasteDisposalCategory>(DISPOSAL_CATEGORIES[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [smartSearchAnswer, setSmartSearchAnswer] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Smart item classification lookup / AI guidance
  const handleSearchSubmit = async (queryToRun: string) => {
    const q = queryToRun || searchQuery;
    if (!q.trim()) return;

    setIsSearching(true);
    setSearchQuery(q);

    try {
      const res = await fetch('/api/disposal-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.guide) {
          setSmartSearchAnswer(data.guide);
          setIsSearching(false);
          fireEcoConfetti();
          return;
        }
      }
    } catch (e) {
      console.warn('Disposal advice fetch error, using local fallback:', e);
    }

    // Heuristic lookup fallback
    setTimeout(() => {
      const lower = q.toLowerCase();
      let resCat = 'Dry Recyclable';
      let bin = 'Blue Bin (Dry Recyclables)';
      let steps = [
        'Rinse to remove oil or residue',
        'Keep dry with paper and cartons',
        'Hand over during Tuesday/Thursday dry waste rounds'
      ];
      let mistake = 'Putting moist or greasy wrappers into dry recyclables.';

      if (lower.includes('coconut') || lower.includes('peel') || lower.includes('food') || lower.includes('leaf') || lower.includes('tea')) {
        resCat = 'Wet / Organic Waste';
        bin = 'Green Bin (Wet Waste)';
        steps = [
          'Collect in green home bin without plastic bag',
          'Drain any excess sauce or liquid',
          'Hand over to daily morning municipal organic cart'
        ];
        mistake = 'Wrapping organic kitchen discards in plastic bags.';
      } else if (lower.includes('charger') || lower.includes('battery') || lower.includes('phone') || lower.includes('bulb') || lower.includes('electronic')) {
        resCat = 'E-Waste & Electronics';
        bin = 'Purple Box / University Drop Kiosk';
        steps = [
          'Store in dry cardboard box',
          'Tape battery terminals',
          'Drop off at Apollo University E-Waste Kiosk'
        ];
        mistake = 'Throwing batteries into municipal bins which causes landfill fires.';
      } else if (lower.includes('medicine') || lower.includes('syringe') || lower.includes('pad') || lower.includes('diaper') || lower.includes('chemical')) {
        resCat = 'Sanitary / Domestic Hazardous';
        bin = 'Red Pouch / Marked Paper';
        steps = [
          'Wrap securely in newspaper marked with a red dot',
          'Hand directly to sanitation staff for safe incineration'
        ];
        mistake = 'Flushing sanitary items down toilets which clogs city sewers.';
      } else if (lower.includes('branch') || lower.includes('mattress') || lower.includes('furniture') || lower.includes('debris') || lower.includes('wood')) {
        resCat = 'Bulky Waste';
        bin = 'On-Demand Bulk Collection Request';
        steps = [
          'Stack neatly inside compound',
          'Click "Request Waste Collection" in CleanCircle',
          'Sanitation tipper will collect at scheduled time'
        ];
        mistake = 'Dumping beside empty plots or burning on the road.';
      }

      setSmartSearchAnswer({
        item: q,
        category: resCat,
        binColor: bin,
        steps,
        commonMistake: mistake,
        environmentalImpact: 'Prevents storm drain choking and keeps toxins out of local soil.'
      });
      setIsSearching(false);
      fireEcoConfetti();
    }, 400);
  };

  const getCategoryIcon = (icon: string) => {
    switch (icon) {
      case 'Leaf': return <Leaf className="w-5 h-5 text-emerald-600" />;
      case 'Recycle': return <Recycle className="w-5 h-5 text-sky-600" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-purple-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      default: return <Truck className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-700/80 text-teal-200 text-xs font-semibold mb-2">
            <Recycle className="w-3.5 h-3.5" />
            <span>Clean Source Segregation Guide</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Household Waste & Proper Disposal</h2>
          <p className="text-sm text-teal-100 mt-1 max-w-2xl">
            Cleanliness starts in our own homes. Segregating waste at source ensures recyclables stay clean, 
            organics become farm compost, and roadside dumping is prevented at the root.
          </p>
        </div>

        {/* Big CTA for Bulk Request */}
        <button
          id="disposal-bulk-cta-btn"
          onClick={onOpenBulkModal}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-md transition active:scale-95 flex items-center gap-2 text-sm shrink-0"
        >
          <Truck className="w-4 h-4" />
          <span>Request Bulk Collection</span>
        </button>
      </div>

      {/* Item Quick Search & AI Classifier */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Don't know how to dispose of an item? Ask CleanCircle:</span>
        </h3>

        <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(searchQuery); }} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type any item (e.g. coconut shell, medicine blister pack, old mixer grinder, tree branches)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition shrink-0"
          >
            {isSearching ? 'Checking...' : 'Check Disposal'}
          </button>
        </form>

        {/* Quick query chips */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span className="text-[11px] text-slate-400 font-medium">Quick examples:</span>
          {COMMON_QUERIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleSearchSubmit(item)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 transition"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Smart Search Result Card */}
        {smartSearchAnswer && (
          <div className="mt-5 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-slate-900 space-y-3 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Item Classified</span>
                <h4 className="text-base font-extrabold text-slate-900">{smartSearchAnswer.item}</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-200 text-emerald-900">
                  Target Bin: {smartSearchAnswer.binColor}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">Correct Steps to Dispose:</span>
              <ul className="text-xs space-y-1 text-slate-600 pl-4 list-disc">
                {smartSearchAnswer.steps?.map((step: string, idx: number) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Common Mistake:</strong> {smartSearchAnswer.commonMistake}</span>
            </div>

            {smartSearchAnswer.category?.includes('Bulky') && (
              <div className="pt-2">
                <button
                  onClick={onOpenBulkModal}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Book Free Bulk Pickup for this Item</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5-Category Interactive Explorer */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Household Segregation Guidelines</h3>
          <span className="text-xs text-slate-500">Chittoor Municipality 2-Bin + Special Rules</span>
        </div>

        {/* Category Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {DISPOSAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 ${
                selectedCategory.id === cat.id
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-1.5 rounded-lg bg-slate-100">
                  {getCategoryIcon(cat.icon)}
                </div>
                <span className={`w-3 h-3 rounded-full ${cat.binColor}`} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 line-clamp-1">{cat.title.split('(')[0]}</span>
                <span className="text-[10px] text-slate-500 block">{cat.colorName}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Category Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100">
                {getCategoryIcon(selectedCategory.icon)}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">{selectedCategory.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Collection Schedule: <strong className="text-emerald-700">{selectedCategory.schedule}</strong></p>
              </div>
            </div>

            {selectedCategory.id === 'cat-bulky' && (
              <button
                onClick={onOpenBulkModal}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0"
              >
                <Truck className="w-4 h-4" />
                <span>Request Waste Collection</span>
              </button>
            )}
          </div>

          {/* Common Items in this Category */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Common Items Included:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedCategory.items.map((item, idx) => (
                <span key={idx} className="text-xs px-3 py-1 bg-slate-100 text-slate-800 rounded-lg font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Dos & Don'ts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Do List */}
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>What to DO:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-950 pl-2">
                {selectedCategory.doList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Don't List */}
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>What to AVOID:</span>
              </div>
              <ul className="space-y-1.5 text-xs text-rose-950 pl-2">
                {selectedCategory.dontList.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Civic Impact Fact */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Why this matters for Chittoor:</strong> {selectedCategory.impactFact}
            </div>
          </div>
        </div>
      </div>

      {/* Bulky Collection Section & History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900">On-Demand Waste Collection for Large Items</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Have heavy furniture, tree trimmings, or large garden biomass? Schedule a free door-step pickup.
            </p>
          </div>

          <button
            onClick={onOpenBulkModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Bulk Pickup</span>
          </button>
        </div>

        {/* Existing Bookings List */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-500">Your Scheduled Collections:</span>
          {bulkRequests.map((req) => (
            <div key={req.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{req.itemType}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    req.status === 'Collected' ? 'bg-emerald-100 text-emerald-800' :
                    req.status === 'Scheduled' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{req.pickupAddress} ({req.area})</p>
                <div className="text-[11px] text-slate-600 flex items-center gap-3">
                  <span>Slot: <strong>{req.preferredDate} ({req.preferredSlot})</strong></span>
                  <span>Est: {req.approxWeightOrCount}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800">
                  +{req.ecoPointsEarned} Pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
