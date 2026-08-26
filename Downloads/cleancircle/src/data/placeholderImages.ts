export const CLEANED_COMMUNITY_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#bae6fd" />
      <stop offset="60%" stop-color="#e0f2fe" />
      <stop offset="100%" stop-color="#f0f9ff" />
    </linearGradient>
    <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
    <linearGradient id="curbGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#cbd5e1" />
      <stop offset="100%" stop-color="#94a3b8" />
    </linearGradient>
  </defs>

  <!-- Sky -->
  <rect x="0" y="0" width="800" height="260" fill="url(#skyGrad)" />
  
  <!-- Subtle distant tree row / green belt -->
  <path d="M0,230 Q80,215 160,225 T320,215 T480,225 T640,210 T800,225 L800,260 L0,260 Z" fill="#86efac" opacity="0.7" />
  <path d="M0,240 Q100,228 200,238 T400,228 T600,236 T800,228 L800,260 L0,260 Z" fill="#4ade80" opacity="0.8" />

  <!-- Single-story community buildings / shops background (Low-rise local architecture) -->
  <!-- Shop 1 (Warm Ochre) -->
  <rect x="50" y="160" width="140" height="100" fill="#fde68a" stroke="#d97706" stroke-width="1.5" />
  <polygon points="40,160 120,135 200,160" fill="#b45309" />
  <rect x="80" y="195" width="45" height="65" fill="#78350f" rx="2" />
  <rect x="135" y="185" width="40" height="40" fill="#93c5fd" stroke="#3b82f6" stroke-width="1" />
  <rect x="45" y="160" width="150" height="12" fill="#059669" rx="2" />

  <!-- Compound wall & small residence (Terracotta / Light Green) -->
  <rect x="220" y="175" width="180" height="85" fill="#fef3c7" stroke="#ca8a04" stroke-width="1.5" />
  <polygon points="210,175 310,150 410,175" fill="#c2410c" />
  <rect x="250" y="200" width="40" height="60" fill="#9a3412" rx="2" />
  <rect x="310" y="195" width="35" height="35" fill="#93c5fd" stroke="#38bdf8" stroke-width="1" />

  <!-- Community Green Tree next to compound -->
  <rect x="420" y="180" width="16" height="80" fill="#78350f" rx="2" />
  <circle cx="428" cy="165" r="42" fill="#16a34a" />
  <circle cx="445" cy="155" r="32" fill="#22c55e" />
  <circle cx="410" cy="160" r="28" fill="#15803d" />

  <!-- Local Community Shop 2 / Apollo Pilot Area building -->
  <rect x="490" y="165" width="160" height="95" fill="#e0e7ff" stroke="#6366f1" stroke-width="1.5" />
  <rect x="480" y="165" width="180" height="14" fill="#2563eb" rx="2" />
  <rect x="520" y="200" width="50" height="60" fill="#312e81" rx="2" />
  <rect x="585" y="195" width="45" height="40" fill="#93c5fd" stroke="#3b82f6" stroke-width="1" />

  <!-- Small corner tree -->
  <rect x="710" y="190" width="14" height="70" fill="#78350f" rx="2" />
  <circle cx="717" cy="175" r="38" fill="#15803d" />

  <!-- Cleaned Paved Footpath & Curb (Spotless & cleared) -->
  <rect x="0" y="260" width="800" height="50" fill="url(#curbGrad)" />
  <!-- Paving tiles lines -->
  <line x1="0" y1="285" x2="800" y2="285" stroke="#94a3b8" stroke-width="1" stroke-dasharray="25,25" />
  <line x1="0" y1="310" x2="800" y2="310" stroke="#64748b" stroke-width="3" />

  <!-- Spotless Clean Road Surface -->
  <rect x="0" y="310" width="800" height="190" fill="url(#roadGrad)" />
  
  <!-- Road markings (Clean & maintained) -->
  <line x1="0" y1="415" x2="800" y2="415" stroke="#ffffff" stroke-width="6" stroke-dasharray="60,40" opacity="0.9" />

  <!-- Roadside Segregated Green & Blue Dustbins on Clean Curb -->
  <rect x="150" y="245" width="22" height="36" fill="#16a34a" rx="4" stroke="#15803d" stroke-width="1" />
  <rect x="148" y="242" width="26" height="6" fill="#15803d" rx="2" />
  <rect x="178" y="245" width="22" height="36" fill="#2563eb" rx="4" stroke="#1d4ed8" stroke-width="1" />
  <rect x="176" y="242" width="26" height="6" fill="#1d4ed8" rx="2" />

  <!-- Clean Banner / Status Stamp -->
  <g transform="translate(240, 390)">
    <rect x="0" y="0" width="320" height="75" rx="10" fill="#064e3b" fill-opacity="0.92" stroke="#10b981" stroke-width="2" />
    <circle cx="38" cy="38" r="22" fill="#10b981" />
    <!-- Checkmark icon -->
    <path d="M28,38 L35,45 L48,30" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
    <text x="70" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="bold" fill="#ffffff">COMMUNITY AREA CLEANED</text>
    <text x="70" y="54" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="500" fill="#a7f3d0">Waste Cleared &amp; Road Swept Spotless</text>
  </g>
</svg>
`)}`;
