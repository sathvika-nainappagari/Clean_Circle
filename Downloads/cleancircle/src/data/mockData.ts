import { 
  UserProfile, 
  WasteReport, 
  CommunityChallenge, 
  WasteDisposalCategory,
  BulkCollectionRequest 
} from '../types';
import { CLEANED_COMMUNITY_PLACEHOLDER } from './placeholderImages';

export const CHITTOOR_AREAS = [
  'Apollo University Campus & Surrounding Community',
  'Murakambattu Residential Colony',
  'Gandhi Road & Market Junction',
  'Kongareddy Palli Main Road',
  'Greamspet Residential Enclave',
  'High Road Commercial Sector',
  'Collectorate & Officer Quarters',
  'Kattamanchi Lake Periphery'
];

export const INITIAL_USER: UserProfile = {
  name: 'Venkata Sai Teja',
  phone: '+91 98480 23456',
  neighborhood: 'Murakambattu Colony (Near Apollo University Campus)',
  city: 'Chittoor, Andhra Pradesh',
  streakDays: 12,
  lastActiveDate: new Date().toISOString().split('T')[0],
  ecoPoints: 480,
  level: 'Green Guardian',
  isVerifiedBadgeHolder: true,
  verificationProgress: {
    reportsCount: 7,
    requiredReports: 5,
    segregationStreak: 12,
    requiredStreak: 10,
    verificationsCount: 4,
    requiredVerifications: 3,
  },
  actionsHistory: [
    {
      id: 'act-1',
      title: 'Daily Source Segregation Verified',
      category: 'Segregation',
      points: 15,
      timestamp: 'Today, 08:15 AM',
      details: 'Handed over green (wet) & blue (dry) bins separately to doorstep collection cart.',
      iconName: 'Sparkles',
    },
    {
      id: 'act-2',
      title: 'Reported Roadside Plastic Dump',
      category: 'Report',
      points: 35,
      timestamp: 'Yesterday, 05:40 PM',
      details: 'Logged location near Apollo University campus road. AI categorized as Drainage Risk.',
      iconName: 'AlertTriangle',
    },
    {
      id: 'act-3',
      title: 'Verified Cleaned Spot at Gandhi Road',
      category: 'Verification',
      points: 20,
      timestamp: '2 days ago',
      details: 'Confirmed municipal team resolved the vegetable market overflow corner.',
      iconName: 'CheckCircle2',
    },
    {
      id: 'act-4',
      title: 'Scheduled Garden Pruning Bulk Pickup',
      category: 'Bulk Collection',
      points: 30,
      timestamp: '4 days ago',
      details: 'Prevented roadside tree branch burning; scheduled dry biomass collection.',
      iconName: 'Truck',
    },
    {
      id: 'act-5',
      title: 'Completed 7-Day Clean Streak Milestone',
      category: 'Daily Habit',
      points: 50,
      timestamp: '5 days ago',
      details: 'Maintained zero-litter daily habits for 7 consecutive days.',
      iconName: 'Flame',
    }
  ]
};

export const INITIAL_REPORTS: WasteReport[] = [
  {
    id: 'rep-101',
    title: 'Plastic Bottle & Polythene Cluster near Drainage Canal',
    location: 'Near Apollo University Campus Approach Road, Chittoor',
    areaName: 'Apollo University Campus & Surrounding Community',
    description: 'Single-use plastic water pouches, tea cups, and snack packets accumulating near the storm drain outlet. Water starting to slow down.',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    reportedAt: '3 hours ago',
    reportedBy: 'Kavitha R. (Student)',
    status: 'Assigned',
    assignedTeam: 'Chittoor Municipal Sector 4 Clean Route & Ward Volunteer',
    verifiedCount: 6,
    userHasVerified: false,
    commentsCount: 3,
    analysis: {
      category: 'Plastic Waste',
      severity: 'High',
      estimatedVolume: '1-2 Sacks along road edge',
      wasteComposition: ['Single-use plastic covers', 'PET beverage bottles', 'Styrofoam tea cups'],
      drainageRisk: 'High - Inflow grate partially obstructed',
      pestRisk: 'Moderate',
      recommendedAction: 'Immediate dry clearance and installation of a dedicated twin-bin unit near tea stall',
      responsibleAdvice: 'Encourage campus cafeteria to eliminate single-use plastic cups with reusable tumblers.',
      ecoPointsReward: 35
    }
  },
  {
    id: 'rep-102',
    title: 'Construction Debris & Dry Mortar on Pedestrian Pathway',
    location: 'Murakambattu 3rd Cross, Opp. Children Park',
    areaName: 'Murakambattu Residential Colony',
    description: 'Broken bricks, cement bags and sand left on sidewalk after house renovation. Forcing school children to walk on the busy road.',
    imageUrl: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?auto=format&fit=crop&w=800&q=80',
    reportedAt: '1 day ago',
    reportedBy: 'P. Ramanatham (Resident)',
    status: 'Cleaning in Progress',
    assignedTeam: 'Ward Bulk Debris Recovery Vehicle',
    verifiedCount: 11,
    userHasVerified: true,
    commentsCount: 5,
    analysis: {
      category: 'Construction & Demolition',
      severity: 'Moderate',
      estimatedVolume: 'Heavy aggregate pile',
      wasteComposition: ['Concrete chunks', 'Red brick fragments', 'Torn cement sacks'],
      drainageRisk: 'Low',
      pestRisk: 'Low',
      recommendedAction: 'C&D waste pickup service dispatched with mini-tipper',
      responsibleAdvice: 'Use the CleanCircle Bulk Request tool before unloading renovation debris on public walkways.',
      ecoPointsReward: 30
    }
  },
  {
    id: 'rep-103',
    title: 'Overflowing Vegetable & Organic Refuse Corner',
    location: 'Gandhi Road Daily Market Corner, Chittoor',
    areaName: 'Gandhi Road & Market Junction',
    description: 'Rotting vegetable leaves, rotten tomatoes, and coconut coir dumped on the curb attracting stray cattle.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    reportedAt: '2 days ago',
    reportedBy: 'Sathish Kumar',
    status: 'Resolved',
    resolvedAt: 'Yesterday, 04:00 PM',
    assignedTeam: 'Gandhi Road Night Sanitation Crew',
    resolvedImageUrl: CLEANED_COMMUNITY_PLACEHOLDER,
    verifiedCount: 18,
    userHasVerified: true,
    commentsCount: 8,
    analysis: {
      category: 'Organic / Food Waste',
      severity: 'High',
      estimatedVolume: 'Multiple vegetable crates',
      wasteComposition: ['Wet vegetable peels', 'Coconut husks', 'Decaying fruit discards'],
      drainageRisk: 'Medium',
      pestRisk: 'High (Fly breeding & stray cow congregation)',
      recommendedAction: 'Direct transfer to Chittoor Community Micro-Composting Center (MCC)',
      responsibleAdvice: 'Vendors should place wet organics directly into organic wheelbarrows twice daily.',
      ecoPointsReward: 40
    }
  },
  {
    id: 'rep-104',
    title: 'Discarded Old Mattresses and Damaged Furniture in Vacant Plot',
    location: 'Kongareddy Palli Main Road, near Water Tank',
    areaName: 'Kongareddy Palli Main Road',
    description: 'Two old coir mattresses and broken plywood wardrobe parts dumped beside the transformer compound.',
    imageUrl: 'https://images.unsplash.com/photo-1528190336454-13cd56b45b5a?auto=format&fit=crop&w=800&q=80',
    reportedAt: '4 hours ago',
    reportedBy: 'Anusha M. (Ward Volunteer)',
    status: 'Reported',
    verifiedCount: 3,
    userHasVerified: false,
    commentsCount: 1,
    analysis: {
      category: 'Bulky Waste',
      severity: 'Moderate',
      estimatedVolume: '2 Mattresses + wood furniture',
      wasteComposition: ['Coir foam', 'Treated plywood', 'Metal springs'],
      drainageRisk: 'Low',
      pestRisk: 'Moderate (Rodent shelter hazard)',
      recommendedAction: 'Assign specialized bulk collection truck for recycling facility transfer',
      responsibleAdvice: 'Book free weekend bulk waste collection through CleanCircle instead of open roadside dumping.',
      ecoPointsReward: 25
    }
  }
];

export const INITIAL_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'ch-1',
    title: 'Apollo University Clean Corridor Challenge',
    description: 'Keep the 1.2 km campus approach road zero-litter for 14 straight days through daily student reporting and spot checks.',
    targetCount: 50,
    currentCount: 38,
    unit: 'Clean Spot Verifications',
    daysRemaining: 4,
    area: 'Apollo University Campus & Surrounding Community',
    participantsCount: 142,
    rewardPoints: 100,
    isJoined: true,
    category: 'Zero-Litter'
  },
  {
    id: 'ch-2',
    title: 'Murakambattu 100% Wet/Dry Segregation Mission',
    description: 'Encourage 100 households in Murakambattu Colony to record 7 consecutive days of two-bin segregated waste handover.',
    targetCount: 100,
    currentCount: 76,
    unit: 'Households Segregating',
    daysRemaining: 6,
    area: 'Murakambattu Residential Colony',
    participantsCount: 89,
    rewardPoints: 120,
    isJoined: true,
    category: 'Segregation'
  },
  {
    id: 'ch-3',
    title: 'Monsoon Monsoon Storm Drain Clear-Track',
    description: 'Identify and verify clearing of 25 critical drainage choke points across Chittoor town before heavy rains.',
    targetCount: 25,
    currentCount: 19,
    unit: 'Drain Grates Cleared',
    daysRemaining: 9,
    area: 'Town-Wide Pilot',
    participantsCount: 215,
    rewardPoints: 150,
    isJoined: false,
    category: 'Drain Clearance'
  }
];

export const DISPOSAL_CATEGORIES: WasteDisposalCategory[] = [
  {
    id: 'cat-wet',
    title: 'Wet / Organic Waste (Green Bin)',
    colorName: 'Emerald Green',
    binColor: 'bg-emerald-500',
    icon: 'Leaf',
    items: [
      'Vegetable & fruit peels',
      'Leftover cooked food & tea powder',
      'Egg shells & chicken/fish bones',
      'Fallen garden leaves & flowers',
      'Coconut shells (chopped small)'
    ],
    doList: [
      'Keep in a separate green household dustbin',
      'Drain excess liquid before putting in bin',
      'Hand over daily to municipal wet waste cart'
    ],
    dontList: [
      'Do NOT line with plastic garbage bags (use newspaper or compostable liner)',
      'Do NOT mix plastic wrappers, thermocol, or milk pouches',
      'Do NOT throw into roadside open storm drains'
    ],
    schedule: 'Collected Daily (7:00 AM - 9:30 AM)',
    impactFact: 'Organic waste converted to compost enriches local Chittoor mango & farm soil while preventing methane buildup.'
  },
  {
    id: 'cat-dry',
    title: 'Dry / Recyclables (Blue Bin)',
    colorName: 'Sky Blue',
    binColor: 'bg-sky-500',
    icon: 'Recycle',
    items: [
      'Plastic containers & milk pouches (rinsed)',
      'Newspapers, cardboard boxes & notebooks',
      'Metal cans, tin foil & metal caps',
      'Glass bottles & jars (unbroken)',
      'Clean plastic snack packets'
    ],
    doList: [
      'Ensure items are dry and free from sticky food residue',
      'Flatten cardboard cartons and squeeze plastic bottles',
      'Collect in a dry reusable bag throughout the week'
    ],
    dontList: [
      'Do NOT mix wet food, gravy, or tea waste with paper/cardboard',
      'Do NOT burn plastics or paper on roadside curbs',
      'Do NOT throw broken glass loose without wrapping in paper'
    ],
    schedule: 'Collected Every Tuesday, Thursday & Saturday',
    impactFact: 'Rinsed clean plastic gets recycled into paver blocks and industrial fibers instead of choking marine canals.'
  },
  {
    id: 'cat-ewaste',
    title: 'E-Waste & Electronics',
    colorName: 'Purple',
    binColor: 'bg-purple-600',
    icon: 'Cpu',
    items: [
      'Old smartphone chargers & broken cables',
      'Dead batteries (AA, AAA, button cells)',
      'Defunct tube lights & LED bulbs',
      'Old computer motherboards & remotes',
      'Broken earphones & small appliances'
    ],
    doList: [
      'Store in a small cardboard box inside your home',
      'Tape battery terminals with masking tape',
      'Drop at designated University E-Waste kiosk or monthly bulk camp'
    ],
    dontList: [
      'NEVER put lithium batteries into general garbage (fire hazard)',
      'Do NOT break tube lights or mercury thermometers',
      'Do NOT hand over to unauthorized informal smelters'
    ],
    schedule: 'Monthly Collection Camp (First Sunday) & University Drop-off Kiosk',
    impactFact: 'Prevents heavy metals like lead and cadmium from leaching into Chittoor groundwater tables.'
  },
  {
    id: 'cat-hazardous',
    title: 'Sanitary & Domestic Hazardous (Red Bin)',
    colorName: 'Rose Red',
    binColor: 'bg-rose-500',
    icon: 'ShieldAlert',
    items: [
      'Used sanitary pads & baby diapers',
      'Expired medicines & blister packs',
      'Used syringes & band-aids',
      'Insecticide / mosquito spray cans',
      'Paints, thinners & cleaning chemicals'
    ],
    doList: [
      'Wrap sanitary waste securely in newspaper marked with a red dot',
      'Hand over directly to sanitation staff marked as hazardous',
      'Keep hazardous chemical bottles tightly sealed'
    ],
    dontList: [
      'Never flush sanitary pads or diapers down the toilet',
      'Do NOT throw needles loose in plastic bags (injures sanitation workers)',
      'Do NOT dump chemical solvents into storm drains'
    ],
    schedule: 'Handed directly daily in marked red pouches',
    impactFact: 'Safeguards the health and dignity of our frontline sanitation workers.'
  },
  {
    id: 'cat-bulky',
    title: 'Bulky Waste & Garden Prunings',
    colorName: 'Amber',
    binColor: 'bg-amber-500',
    icon: 'Truck',
    items: [
      'Old mattresses & sofa cushions',
      'Broken wooden tables, chairs & plywood',
      'Tree branches & large garden foliage',
      'Old bicycles & large metal scrap',
      'Discarded bathroom ceramics / tiles'
    ],
    doList: [
      'Stack neatly inside your house compound or private gate',
      'Use the CleanCircle "Request Waste Collection" tool for doorstep pickup',
      'Bundle tree branches with natural jute twine'
    ],
    dontList: [
      'Do NOT dump quietly on the roadside under cover of darkness',
      'Do NOT burn leaves and furniture on public roads',
      'Do NOT block storm drainage canals with tree limbs'
    ],
    schedule: 'On-Demand Pickup via CleanCircle within 24-48 Hours',
    impactFact: 'Eliminates unsightly roadside dumping hotspots and keeps sidewalks safe for pedestrians.'
  }
];

export const INITIAL_BULK_REQUESTS: BulkCollectionRequest[] = [
  {
    id: 'blk-501',
    itemType: 'Garden Pruning & Trimmed Mango Tree Branches',
    approxWeightOrCount: 'Approx 3 large bundles (40-50 kg)',
    pickupAddress: 'Door No 4-112, Murakambattu Colony, Near Sai Temple',
    area: 'Murakambattu Residential Colony',
    preferredDate: 'Tomorrow',
    preferredSlot: 'Morning (7 AM - 10 AM)',
    notes: 'Branches are bundled and kept near the outer gate for easy loading.',
    status: 'Scheduled',
    submittedAt: 'Today, 10:30 AM',
    ecoPointsEarned: 30
  }
];
