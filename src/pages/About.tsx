import React from 'react';
import { Moon, Sun, Globe2, Mountain, ShieldAlert, Award, Rocket, CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-900/40 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono">
          <Award className="w-3.5 h-3.5 text-cyan-400" />
          <span>NASA Space Apps Challenge 2026 — Problem: Lunar Landing Site Navigator</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold font-mono text-white tracking-wider">
          LUNA<span className="text-cyan-400">VISTA</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Terrain-Aware Lunar Landing Site Evaluation & Mission Planning Platform
        </p>

        {/* Prominent Disclaimer Banner */}
        <div className="bg-amber-950/30 border border-amber-500/40 p-4 rounded-xl text-left flex items-start space-x-3 text-xs text-amber-200 mt-4">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold font-mono uppercase tracking-wider block text-amber-300">
              Scientific Prototype Disclaimer
            </span>
            <p className="mt-1 leading-relaxed text-amber-200/90 font-sans">
              This is an early-stage conceptual prototype developed for college screening. Displayed metrics, topographic profiles, and orbital ephemeris visualizations use illustrative simulated data and are not validated for actual lunar mission planning. NASA and partner data products are cited as planned future integrations.
            </p>
          </div>
        </div>
      </div>

      {/* Core Scientific Pillars */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-white uppercase tracking-wider">
          Why Polar Lunar Navigation Demands Terrain Awareness
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Sunlight */}
          <div className="glass-panel p-5 rounded-xl border border-cyan-900/30 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm font-mono text-white">Why Sunlight Matters</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Solar power sustains lunar landers and rovers. At the lunar poles, the solar elevation never rises more than ~1.5° to 2.5° above the horizon. Elevated peaks can receive near-permanent illumination, while depression basins experience permanent darkness with cryogenic temperatures of 40 Kelvin (-233°C).
            </p>
          </div>

          {/* Pillar 2: Direct Earth Visibility */}
          <div className="glass-panel p-5 rounded-xl border border-cyan-900/30 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm font-mono text-white">Why Earth RF Matters</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Direct line-of-sight to Earth enables uninterrupted telemetry and command links with NASA's Deep Space Network (DSN) without waiting for orbital relay passes. Lunar physical librations cause Earth to oscillate slightly, causing periodic communication dropouts if occluded by nearby crater rims.
            </p>
          </div>

          {/* Pillar 3: Topographic Masking */}
          <div className="glass-panel p-5 rounded-xl border border-cyan-900/30 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Mountain className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm font-mono text-white">Why Terrain Matters</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Standard celestial models calculate elevation relative to a smooth spherical datum. However, actual lunar topography features mountains up to 5,000m high. A mountain ridge 40 km away easily blocks low-angle solar rays and RF signals. LUNAVISTA models the real 360° horizon silhouette.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Vision & Goals */}
      <div className="glass-panel p-6 rounded-xl border border-cyan-900/30 space-y-4">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Rocket className="w-5 h-5" />
          <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
            What LUNAVISTA Aims to Achieve
          </h2>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Universal Lunar Coordinate Accessibility:</strong> Enable mission planners and researchers to evaluate any arbitrary coordinate on the Moon (-90° to +90° Lat, -180° to +180° Lon) rather than only predefined catalog sites.
            </span>
          </div>

          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Integrated Power & Telemetry Trade Studies:</strong> Unify solar availability and direct Earth communication into a single interactive 4-state operational timeline with worst-case outage bounds.
            </span>
          </div>

          <div className="flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Democratized Aerospace Visualization:</strong> Deliver a fast, responsive, web-based tool that eliminates the steep learning curve of complex command-line SPICE utilities and massive GIS desktop packages.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
