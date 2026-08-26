import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Droplets, 
  Wind, 
  Bug, 
  HelpCircle, 
  TrendingDown, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  XCircle,
  Activity,
  Layers
} from 'lucide-react';

export const ImpactView: React.FC = () => {
  const [householdSlider, setHouseholdSlider] = useState<number>(100);

  // Impact Calculations for Chittoor
  const monthlyKgWasteDiverted = householdSlider * 15; // 15 kg dry plastic/carton segregated
  const cloggedDrainsPrevented = Math.round(householdSlider * 0.12);
  const organicCompostCreatedKg = householdSlider * 28; // 28 kg wet waste converted
  const pestRiskReductionPercent = Math.min(85, Math.round(householdSlider * 0.45));

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Civic Environmental Awareness</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Understanding the Real Impact of Roadside Dumping
          </h2>

          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            When waste sits by the road, the consequences are immediate and local. 
            Understanding the realistic chain reactions helps us build lasting daily habits.
          </p>
        </div>
      </div>

      {/* 4 Core Realistic Environmental Impact Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Drainage Blockage */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Drainage Blockage & Monsoon Waterlogging</h3>
              <span className="text-xs text-sky-700 font-semibold">Stormwater Choke Points</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Lightweight plastic covers, snack wrappers, and styrofoam tea cups are carried by rainwater 
            straight into storm gutters and drainage culverts. Even a single sack of roadside plastic 
            can seal a drainage grate, causing rainwater to back up into residential streets and basements.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-center justify-between">
            <span>Primary Culprit: Single-use polythene bags</span>
            <span className="font-bold text-sky-800">High Monsoon Hazard</span>
          </div>
        </div>

        {/* Pest & Vector Breeding */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Bug className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Vector Breeding & Stagnant Pools</h3>
              <span className="text-xs text-amber-700 font-semibold">Pest Habitat Creation</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Discarded plastic cups, coconut shells, and open plastic containers collect small pools of fresh rainwater. 
            These micro-puddles become ideal breeding grounds for mosquitoes and houseflies right next to homes 
            and college hostels.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-center justify-between">
            <span>Primary Culprit: Open coconut shells & empty cups</span>
            <span className="font-bold text-amber-800">Vector Breeding Ground</span>
          </div>
        </div>

        {/* Curb Burning Hazards */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Toxic Smoke from Curb-Side Burning</h3>
              <span className="text-xs text-rose-700 font-semibold">Air Quality & Respiratory Irritation</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            When dry leaves and roadside plastic sweepings are set on fire to "dispose" of them quickly, 
            they release dioxins, furans, and particulate smoke. This smoke settles in low-lying residential alleys, 
            troubling elderly residents and children.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-center justify-between">
            <span>Solution: Biomass composting & dry pickup</span>
            <span className="font-bold text-rose-800">Zero Curb Burning</span>
          </div>
        </div>

        {/* Stray Animal & Soil Contamination */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Livestock Ingestion & Soil Degradation</h3>
              <span className="text-xs text-emerald-700 font-semibold">Animal Welfare & Local Soil</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Stray cows and goats forage through unsegregated food waste tied inside plastic bags, 
            often swallowing the plastic whole. Over time, non-biodegradable plastics break into microplastics 
            that degrade local garden soil and surrounding farmlands.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-center justify-between">
            <span>Solution: Hand over wet food waste untied</span>
            <span className="font-bold text-emerald-800">Protects Local Fauna</span>
          </div>
        </div>
      </div>

      {/* Interactive Civic Habit Impact Calculator */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Interactive Community Clean Impact Simulator</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              See what happens when households in your Chittoor neighborhood adopt daily 2-bin segregation.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Neighborhood Scale Model
          </span>
        </div>

        {/* Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-bold text-slate-900">
            <span>Participating Households in Colony:</span>
            <span className="text-emerald-700 text-base">{householdSlider} Homes</span>
          </div>
          <input
            type="range"
            min={10}
            max={500}
            step={10}
            value={householdSlider}
            onChange={(e) => setHouseholdSlider(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>10 Homes (Street Corner)</span>
            <span>150 Homes (Colony)</span>
            <span>500 Homes (Ward/Campus)</span>
          </div>
        </div>

        {/* Projected Monthly Civic Outcomes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-xs text-emerald-800 font-semibold block">Dry Plastic Recycled</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-950 mt-1 block">
              {monthlyKgWasteDiverted} kg/mo
            </span>
            <span className="text-[10px] text-emerald-700">Diverted from roadsides</span>
          </div>

          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-center">
            <span className="text-xs text-teal-800 font-semibold block">Organic Compost Made</span>
            <span className="text-xl sm:text-2xl font-black text-teal-950 mt-1 block">
              {organicCompostCreatedKg} kg/mo
            </span>
            <span className="text-[10px] text-teal-700">For Chittoor mango groves</span>
          </div>

          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-center">
            <span className="text-xs text-sky-800 font-semibold block">Drain Chokes Prevented</span>
            <span className="text-xl sm:text-2xl font-black text-sky-950 mt-1 block">
              ~{cloggedDrainsPrevented} Hotspots
            </span>
            <span className="text-[10px] text-sky-700">Monsoon flood protection</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs text-amber-800 font-semibold block">Pest Risk Reduction</span>
            <span className="text-xl sm:text-2xl font-black text-amber-950 mt-1 block">
              {pestRiskReductionPercent}%
            </span>
            <span className="text-[10px] text-amber-700">Less stagnant water spots</span>
          </div>
        </div>
      </div>
    </div>
  );
};
