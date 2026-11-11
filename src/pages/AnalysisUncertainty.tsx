import React, { useState } from 'react';
import { Shield, AlertTriangle, Layers, TrendingUp, Sun, Globe2, Eye, Compass } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line } from 'recharts';

export const AnalysisUncertainty: React.FC = () => {
  const [selectedBody, setSelectedBody] = useState<'SUN' | 'EARTH'>('SUN');

  // Simulated DEM Monte Carlo ensemble data across azimuth (0° to 360°)
  const uncertaintyData = [
    { azimuth: '0° N', nominal: 1.8, p10: 1.2, p50: 1.7, p90: 2.6 },
    { azimuth: '30°', nominal: 1.5, p10: 0.9, p50: 1.4, p90: 2.2 },
    { azimuth: '60°', nominal: 2.1, p10: 1.4, p50: 2.0, p90: 3.1 },
    { azimuth: '90° E', nominal: 2.8, p10: 1.9, p50: 2.7, p90: 3.8 },
    { azimuth: '120°', nominal: 3.4, p10: 2.5, p50: 3.3, p90: 4.5 },
    { azimuth: '150°', nominal: 2.6, p10: 1.8, p50: 2.5, p90: 3.6 },
    { azimuth: '180° S', nominal: 1.2, p10: 0.6, p50: 1.1, p90: 1.9 },
    { azimuth: '210°', nominal: 0.9, p10: 0.4, p50: 0.8, p90: 1.6 },
    { azimuth: '240°', nominal: 1.4, p10: 0.8, p50: 1.3, p90: 2.1 },
    { azimuth: '270° W', nominal: 2.3, p10: 1.6, p50: 2.2, p90: 3.2 },
    { azimuth: '300°', nominal: 2.9, p10: 2.1, p50: 2.8, p90: 3.9 },
    { azimuth: '330°', nominal: 2.2, p10: 1.5, p50: 2.1, p90: 3.0 },
    { azimuth: '360° N', nominal: 1.8, p10: 1.2, p50: 1.7, p90: 2.6 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-900/30 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              SCIENTIFIC INTEGRITY
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-mono text-white tracking-wide">
              ANALYSIS & UNCERTAINTY QUANTIFICATION
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Topographic error propagation, DEM ensemble confidence envelopes, and landing footprint illumination risk.
          </p>
        </div>

        <div className="text-[11px] font-mono text-amber-300/90 bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-800/40 flex items-center space-x-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Conceptual Stochastic Model (Synthetic Data)</span>
        </div>
      </div>

      {/* Terrain Quality Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-cyan-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">DEM Spatial Resolution</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">5.0 m / pixel</div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center space-x-1">
            <span>High-Precision Polar Product</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-cyan-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Laser Altimetry Tracks</span>
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">94.2% Direct</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">LOLA orbit ground crossings</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-cyan-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Kriging Interpolation</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-300 mt-1">5.8% Infilled</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Inter-track gap synthesis</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-cyan-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Quality Classification</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300 mt-1">TIER 1 (POLAR)</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Suitable for Horizon Masking</div>
        </div>
      </div>

      {/* DEM Uncertainty Graph: Nominal vs P10, P50, P90 */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-900/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm text-white font-mono uppercase flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Horizon Masking Elevation Uncertainty Envelope (Degrees vs. Azimuth)</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Stochastic ensemble of 500 DEM perturbations (P10 lower bound, P50 median, P90 upper bound vs. Nominal DEM)
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-950 text-slate-400 border border-slate-800 self-start sm:self-auto">
            1σ Elevation Error ±1.4m
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={uncertaintyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="ensembleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="azimuth" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="°" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#060d1f',
                  borderColor: '#0891b2',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Area type="monotone" dataKey="p90" stroke="#0ea5e9" fill="url(#ensembleGrad)" name="P90 (Upper Bound)" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="p50" stroke="#38bdf8" strokeWidth={1.5} name="P50 (Median)" />
              <Area type="monotone" dataKey="p10" stroke="#0284c7" fill="#030712" name="P10 (Lower Bound)" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="nominal" stroke="#f59e0b" strokeWidth={2.5} name="Nominal DEM Result" dot={{ r: 3, fill: '#f59e0b' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Landing Footprint Heatmap & Explain Visibility Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Landing Footprint Heatmap (6 cols) */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-xl border border-cyan-900/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-semibold text-sm text-white font-mono uppercase">
                Landing Dispersion Ellipse (1σ / 3σ Footprint)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Micro-illumination variance across 500m × 300m landing footprint
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">100m Grid</span>
          </div>

          {/* SVG Heatmap Representation */}
          <div className="relative w-full h-64 bg-space-950 rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            <svg viewBox="0 0 400 240" className="w-full h-full select-none">
              {/* Grid Background */}
              <defs>
                <pattern id="footprintGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                </pattern>
                {/* Illumination gradient across footprint */}
                <radialGradient id="heatGrad" cx="45%" cy="40%" r="55%">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                  <stop offset="35%" stopColor="#84cc16" stopOpacity="0.65" />
                  <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="90%" stopColor="#ef4444" stopOpacity="0.6" />
                </radialGradient>
              </defs>

              <rect width="400" height="240" fill="#070d1e" />
              <rect width="400" height="240" fill="url(#footprintGrid)" />

              {/* Topographic Contour Lines */}
              <ellipse cx="200" cy="120" rx="170" ry="90" fill="none" stroke="#1e293b" strokeWidth="1" />
              <ellipse cx="200" cy="120" rx="120" ry="65" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 2" />

              {/* 3σ Outer Landing Ellipse */}
              <ellipse cx="200" cy="120" rx="140" ry="75" fill="url(#heatGrad)" opacity="0.35" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="3 3" />

              {/* 1σ Target Ellipse */}
              <ellipse cx="190" cy="115" rx="75" ry="40" fill="url(#heatGrad)" opacity="0.75" stroke="#22c55e" strokeWidth="1.8" />

              {/* Target Aim Point */}
              <circle cx="190" cy="115" r="4" fill="#ffffff" />
              <line x1="175" y1="115" x2="205" y2="115" stroke="#ffffff" strokeWidth="1" />
              <line x1="190" y1="100" x2="190" y2="130" stroke="#ffffff" strokeWidth="1" />

              <text x="200" y="112" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">AIM POINT</text>
              <text x="30" y="30" fill="#64748b" fontSize="10" fontFamily="monospace">WEST FLANK (HIGH ILLUMINATION)</text>
              <text x="210" y="225" fill="#f43f5e" fontSize="10" fontFamily="monospace">EAST RIDGE DEPRESSION (SHADOW TRAP)</text>
            </svg>
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Illumination Probability:</span>
            <div className="flex items-center space-x-2">
              <span className="text-emerald-400">&gt;85% (Favourable)</span>
              <div className="w-24 h-2.5 rounded bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500"></div>
              <span className="text-rose-400">&lt;30% (Persistent Shadow)</span>
            </div>
          </div>
        </div>

        {/* Explain Visibility Panel (6 cols) */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-xl border border-cyan-900/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-semibold text-sm text-white font-mono uppercase">
                Line-of-Sight Horizon Silhouette Explanation
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Physical obstruction reasoning along ray path
              </p>
            </div>
            
            <div className="flex space-x-1 text-xs font-mono bg-space-950 p-1 rounded border border-slate-800">
              <button
                onClick={() => setSelectedBody('SUN')}
                className={`px-2 py-0.5 rounded ${selectedBody === 'SUN' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400'}`}
              >
                Sun
              </button>
              <button
                onClick={() => setSelectedBody('EARTH')}
                className={`px-2 py-0.5 rounded ${selectedBody === 'EARTH' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400'}`}
              >
                Earth
              </button>
            </div>
          </div>

          {/* Ray Cross-section Diagram */}
          <div className="p-4 bg-space-950 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Ray Vector Azimuth:</span>
              <span className="text-white font-semibold">
                {selectedBody === 'SUN' ? '142.5° (South-East)' : '28.2° (North-North-East)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Target Celestial Elevation:</span>
              <span className="text-amber-300 font-semibold">
                {selectedBody === 'SUN' ? '+2.40° Above Math Horizon' : '+5.80° Above Math Horizon'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Local Terrain Horizon Height:</span>
              <span className="text-cyan-300 font-semibold">+1.85° Mountain Crest</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Clearance Margin:</span>
              <span className="text-emerald-400 font-semibold">
                {selectedBody === 'SUN' ? '+0.55° CLEAR' : '+3.95° HIGH CLEARANCE'}
              </span>
            </div>

            {/* Visual Cross Section Illustration */}
            <div className="h-28 w-full bg-[#060c1d] rounded border border-slate-800 p-2 relative overflow-hidden">
              <svg viewBox="0 0 300 90" className="w-full h-full">
                {/* Surface Datum */}
                <line x1="0" y1="80" x2="300" y2="80" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                <text x="5" y="76" fill="#64748b" fontSize="8" fontFamily="monospace">0° Mathematical Horizon</text>

                {/* Mountain Ridge Profile */}
                <path d="M 0 80 Q 80 80 140 45 T 220 70 L 300 80 L 300 90 L 0 90 Z" fill="#1e293b" stroke="#0ea5e9" strokeWidth="1.5" />
                <text x="110" y="38" fill="#38bdf8" fontSize="8" fontFamily="monospace">Blocking Ridge (14km)</text>

                {/* Observer Mast at Left */}
                <line x1="20" y1="80" x2="20" y2="65" stroke="#22c55e" strokeWidth="2" />
                <circle cx="20" cy="65" r="2" fill="#22c55e" />
                <text x="25" y="68" fill="#22c55e" fontSize="8" fontFamily="monospace">Lander Mast</text>

                {/* Celestial Ray Line */}
                <line x1="20" y1="65" x2="280" y2={selectedBody === 'SUN' ? '30' : '15'} stroke={selectedBody === 'SUN' ? '#f59e0b' : '#38bdf8'} strokeWidth="1.5" strokeDasharray="4 2" />
                <circle cx="280" cy={selectedBody === 'SUN' ? '30' : '15'} r="5" fill={selectedBody === 'SUN' ? '#fbbf24' : '#0284c7'} />
                <text x="220" y={selectedBody === 'SUN' ? '25' : '12'} fill={selectedBody === 'SUN' ? '#fbbf24' : '#38bdf8'} fontSize="8" fontFamily="monospace">
                  {selectedBody}
                </text>
              </svg>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Ray tracing establishes that the lander mast clears the elevated ridge 14 km distant by 0.55° of arc, maintaining direct illumination without deep crater shadowing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
