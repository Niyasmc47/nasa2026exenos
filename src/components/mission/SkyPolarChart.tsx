import React, { useState } from 'react';
import { Sun, Globe2, Eye, ShieldAlert, Compass } from 'lucide-react';

interface SkyPolarChartProps {
  sunAzimuth?: number; // 0 to 360
  sunElevation?: number; // -10 to 90
  earthAzimuth?: number; // 0 to 360
  earthElevation?: number; // -10 to 90
  activeView?: 'COMBINED' | 'SUN' | 'EARTH';
  onViewChange?: (view: 'COMBINED' | 'SUN' | 'EARTH') => void;
}

export const SkyPolarChart: React.FC<SkyPolarChartProps> = ({
  sunAzimuth = 142.5,
  sunElevation = 2.4,
  earthAzimuth = 28.2,
  earthElevation = 5.8,
  activeView: controlledView,
  onViewChange
}) => {
  const [internalView, setInternalView] = useState<'COMBINED' | 'SUN' | 'EARTH'>('COMBINED');
  const activeView = controlledView || internalView;
  const setView = onViewChange || setInternalView;

  // Polar projection geometry
  const center = 160;
  const maxRadius = 135;

  // Elevation scale: 0° is rim (radius = maxRadius), 90° is center (radius = 0)
  const getPolarPos = (azimuthDeg: number, elevationDeg: number) => {
    const clampedElev = Math.max(-5, Math.min(90, elevationDeg));
    const r = maxRadius * (1 - clampedElev / 90);
    // 0° Azimuth = North (top = -Y), 90° = East (+X)
    const rad = ((azimuthDeg - 90) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
      r
    };
  };

  // Generate simulated local jagged terrain horizon silhouette (crater rims / mountains)
  // Terrain horizon elevation in degrees (1° to 3.5° for south pole craters)
  const numRays = 72;
  const terrainPoints = [];
  for (let i = 0; i <= numRays; i++) {
    const az = (i / numRays) * 360;
    // Simulated terrain height variation with peaks at 110° and 320°
    const ridgeElev = 1.4 + 1.2 * Math.sin((az * 2 * Math.PI) / 180 + 1.2) + 0.8 * Math.cos((az * 4 * Math.PI) / 180);
    const pos = getPolarPos(az, Math.max(0.5, ridgeElev));
    terrainPoints.push(`${pos.x},${pos.y}`);
  }
  const terrainPath = `M ${terrainPoints.join(' L ')} Z`;

  // Sun and Earth positions
  const sunPos = getPolarPos(sunAzimuth, sunElevation);
  const earthPos = getPolarPos(earthAzimuth, earthElevation);

  // Check obstruction against horizon at their azimuths
  const getHorizonAtAz = (az: number) => 1.4 + 1.2 * Math.sin((az * 2 * Math.PI) / 180 + 1.2) + 0.8 * Math.cos((az * 4 * Math.PI) / 180);
  const sunHorizonAtAz = getHorizonAtAz(sunAzimuth);
  const earthHorizonAtAz = getHorizonAtAz(earthAzimuth);

  const isSunOccluded = sunElevation <= sunHorizonAtAz;
  const isEarthOccluded = earthElevation <= earthHorizonAtAz;

  return (
    <div className="glass-panel p-5 rounded-xl border border-cyan-900/30">
      {/* Header with View Filter Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm tracking-wide text-white">TOPOCENTRIC SKY DOME & HORIZON</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Polar stereographic view (Zenith at center, 0° horizon at outer ring)
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-space-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setView('COMBINED')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeView === 'COMBINED' ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            Combined
          </button>
          <button
            onClick={() => setView('SUN')}
            className={`px-2.5 py-1 rounded flex items-center space-x-1 transition-colors ${
              activeView === 'SUN' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3 h-3" />
            <span>Sun</span>
          </button>
          <button
            onClick={() => setView('EARTH')}
            className={`px-2.5 py-1 rounded flex items-center space-x-1 transition-colors ${
              activeView === 'EARTH' ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe2 className="w-3 h-3" />
            <span>Earth</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Polar SVG Chart */}
        <div className="md:col-span-7 flex justify-center">
          <div className="relative w-[320px] h-[320px]">
            <svg viewBox="0 0 320 320" className="w-full h-full select-none">
              {/* Outer Horizon Mask background */}
              <circle cx={center} cy={center} r={maxRadius} fill="#050a17" stroke="#1e293b" strokeWidth="1.5" />

              {/* Elevation Rings */}
              <circle cx={center} cy={center} r={maxRadius * (2 / 3)} fill="none" stroke="#1e293b" strokeDasharray="3 3" />
              <circle cx={center} cy={center} r={maxRadius * (1 / 3)} fill="none" stroke="#1e293b" strokeDasharray="3 3" />
              <circle cx={center} cy={center} r={2} fill="#38bdf8" />

              {/* Elevation Labels */}
              <text x={center + 4} y={center - maxRadius * (1 / 3) + 3} fill="#64748b" fontSize="9" fontFamily="monospace">60°</text>
              <text x={center + 4} y={center - maxRadius * (2 / 3) + 3} fill="#64748b" fontSize="9" fontFamily="monospace">30°</text>
              <text x={center + 4} y={center - maxRadius + 12} fill="#64748b" fontSize="9" fontFamily="monospace">0° (Horizon)</text>

              {/* Cardinal Azimuth axes */}
              <line x1={center} y1={center - maxRadius} x2={center} y2={center + maxRadius} stroke="#1e293b" strokeWidth="1" />
              <line x1={center - maxRadius} y1={center} x2={center + maxRadius} y2={center} stroke="#1e293b" strokeWidth="1" />

              {/* Cardinal Labels */}
              <text x={center} y={center - maxRadius - 6} fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">N (0°)</text>
              <text x={center + maxRadius + 14} y={center + 4} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">E (90°)</text>
              <text x={center} y={center + maxRadius + 16} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">S (180°)</text>
              <text x={center - maxRadius - 14} y={center + 4} fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">W (270°)</text>

              {/* Terrain Horizon Mask Region (Obstructed zone around perimeter) */}
              <path
                d={`M 0,0 L 320,0 L 320,320 L 0,320 Z M ${center + maxRadius},${center} A ${maxRadius},${maxRadius} 0 1,0 ${center - maxRadius},${center} A ${maxRadius},${maxRadius} 0 1,0 ${center + maxRadius},${center} Z`}
                fill="#030712"
                fillRule="evenodd"
                opacity="0.95"
              />

              {/* Jagged Terrain Horizon Contour */}
              <path
                d={terrainPath}
                fill="rgba(15, 23, 42, 0.4)"
                stroke="#f59e0b"
                strokeWidth="1.8"
                strokeDasharray="4 2"
              />

              {/* Sun Marker */}
              {(activeView === 'COMBINED' || activeView === 'SUN') && (
                <g transform={`translate(${sunPos.x}, ${sunPos.y})`}>
                  {/* Sun ray glow */}
                  <circle cx="0" cy="0" r="14" fill="rgba(245, 158, 11, 0.15)" />
                  <circle cx="0" cy="0" r="7" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                  <line x1="-10" y1="0" x2="-7" y2="0" stroke="#f59e0b" strokeWidth="1.5" />
                  <line x1="7" y1="0" x2="10" y2="0" stroke="#f59e0b" strokeWidth="1.5" />
                  <line x1="0" y1="-10" x2="0" y2="-7" stroke="#f59e0b" strokeWidth="1.5" />
                  <line x1="0" y1="7" x2="0" y2="10" stroke="#f59e0b" strokeWidth="1.5" />
                  <text x="12" y="4" fill="#fbbf24" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    SUN ({sunElevation.toFixed(1)}°)
                  </text>
                </g>
              )}

              {/* Earth Marker */}
              {(activeView === 'COMBINED' || activeView === 'EARTH') && (
                <g transform={`translate(${earthPos.x}, ${earthPos.y})`}>
                  {/* Earth radio waves glow */}
                  <circle cx="0" cy="0" r="14" fill="rgba(56, 189, 248, 0.18)" />
                  <circle cx="0" cy="0" r="7" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="-1.5" cy="-1.5" r="2.5" fill="#38bdf8" opacity="0.8" />
                  <text x="12" y="4" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
                    EARTH ({earthElevation.toFixed(1)}°)
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Legend & Real-time Metrics Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Celestial Elevation & Line of Sight
            </h4>

            {/* Sun Card */}
            <div className={`p-3 rounded-lg border transition-all ${
              !isSunOccluded
                ? 'bg-amber-950/20 border-amber-500/30'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-white">Sun Ray Vector</span>
                </div>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                  !isSunOccluded ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {!isSunOccluded ? 'CLEAR ILLUMINATION' : 'TERRAIN OCCLUDED'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-xs font-mono text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">AZIMUTH</span>
                  {sunAzimuth.toFixed(1)}° (SE)
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ELEVATION</span>
                  {sunElevation.toFixed(1)}° (Horizon: {sunHorizonAtAz.toFixed(1)}°)
                </div>
              </div>
            </div>

            {/* Earth Card */}
            <div className={`p-3 rounded-lg border transition-all ${
              !isEarthOccluded
                ? 'bg-blue-950/20 border-cyan-500/30'
                : 'bg-rose-950/20 border-rose-500/30'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">Earth RF Vector</span>
                </div>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                  !isEarthOccluded ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {!isEarthOccluded ? 'DIRECT LINE-OF-SIGHT' : 'RF SHADOWED'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-xs font-mono text-slate-300">
                <div>
                  <span className="text-slate-500 block text-[10px]">AZIMUTH</span>
                  {earthAzimuth.toFixed(1)}° (NNE)
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ELEVATION</span>
                  {earthElevation.toFixed(1)}° (Horizon: {earthHorizonAtAz.toFixed(1)}°)
                </div>
              </div>
            </div>
          </div>

          {/* Scientific Context Box */}
          <div className="bg-space-950/70 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-mono font-semibold text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>TERRAIN MASKING PHYSICS</span>
            </div>
            <p className="leading-relaxed">
              At the lunar south pole, solar rays graze the surface at elevations of only -1.5° to +2.5°. A 2,000m crater rim 50 km away projects an obstacle angle of ~2.3°, casting shadows hundreds of kilometers across the polar plains and occulting direct Earth S-band/X-band links.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
