import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  MapPin, 
  Calendar, 
  Clock, 
  Check, 
  Sparkles, 
  AlertCircle,
  PackageCheck
} from 'lucide-react';
import { BulkCollectionRequest, UserProfile } from '../types';
import { CHITTOOR_AREAS } from '../data/mockData';
import { fireBigCelebration } from '../utils/confetti';

interface BulkRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  selectedArea: string;
  onSubmitRequest: (newReq: BulkCollectionRequest) => void;
}

export const BulkRequestModal: React.FC<BulkRequestModalProps> = ({
  isOpen,
  onClose,
  user,
  selectedArea,
  onSubmitRequest,
}) => {
  if (!isOpen) return null;

  const [itemType, setItemType] = useState<string>('Pruned Garden Branches & Leaves');
  const [approxWeightOrCount, setApproxWeightOrCount] = useState<string>('2-3 Large Bundles (approx 30 kg)');
  const [area, setArea] = useState<string>(selectedArea !== 'All Pilot Areas' ? selectedArea : CHITTOOR_AREAS[1]);
  const [pickupAddress, setPickupAddress] = useState<string>(`Door No. 12-45, ${area}`);
  const [preferredDate, setPreferredDate] = useState<string>('Tomorrow Morning');
  const [preferredSlot, setPreferredSlot] = useState<BulkCollectionRequest['preferredSlot']>('Morning (7 AM - 10 AM)');
  const [notes, setNotes] = useState<string>('Items are bundled and stacked near the outer gate.');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newReq: BulkCollectionRequest = {
      id: `blk-${Date.now()}`,
      itemType,
      approxWeightOrCount,
      pickupAddress,
      area,
      preferredDate,
      preferredSlot,
      notes,
      status: 'Scheduled',
      submittedAt: 'Just now',
      ecoPointsEarned: 30,
    };

    onSubmitRequest(newReq);
    fireBigCelebration();
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10">
              <Truck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Request Bulk Waste Collection</h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">
                  Demo
                </span>
              </div>
              <p className="text-xs text-emerald-200">Simulated doorstep bulk pickup workflow</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-amber-50 px-4 py-1.5 border-b border-amber-200 text-[11px] text-amber-900 text-center">
          <strong>Prototype Demo</strong>: Submitting this form demonstrates the citizen scheduling workflow (not dispatched to real municipal vehicles).
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <PackageCheck className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Pickup Scheduled! (Demo)</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Simulated demonstration: Request logged and +30 Eco Points added to your demo profile.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Type of Large / Bulky Waste
              </label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Pruned Garden Branches & Leaves">Pruned Garden Branches & Dry Foliage</option>
                <option value="Old Mattresses & Cushions">Old Mattresses / Coir Cushions</option>
                <option value="Broken Plywood / Wood Furniture">Broken Wooden Plywood / Chairs / Tables</option>
                <option value="Renovation Debris & Broken Tiles">Small Home Renovation Debris / Broken Tiles</option>
                <option value="Old Large Appliances / Scrap">Defunct Large Metal Scrap / Appliance</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Estimated Quantity
                </label>
                <input
                  type="text"
                  required
                  value={approxWeightOrCount}
                  onChange={(e) => setApproxWeightOrCount(e.target.value)}
                  placeholder="e.g. 2 bundles or 1 sofa"
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chittoor Pilot Area
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                >
                  {CHITTOOR_AREAS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Doorstep Pickup Address & Landmark
              </label>
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="House / Door No., Street, Landmark"
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Preferred Day
                </label>
                <select
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Today (Within 4 hrs)">Today (Express Afternoon)</option>
                  <option value="Tomorrow Morning">Tomorrow Morning</option>
                  <option value="This Saturday">This Saturday (Weekend Drive)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Time Slot
                </label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value as any)}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Morning (7 AM - 10 AM)">Morning (7 AM - 10 AM)</option>
                  <option value="Afternoon (1 PM - 4 PM)">Afternoon (1 PM - 4 PM)</option>
                  <option value="Evening (5 PM - 7 PM)">Evening (5 PM - 7 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Special Instructions for Loader Crew
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center justify-between">
              <span>Prevents roadside dumping & avoids open burning.</span>
              <span className="font-bold">+30 Eco Points</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Bulk Pickup</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
