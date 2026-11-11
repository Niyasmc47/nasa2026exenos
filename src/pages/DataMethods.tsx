import React from 'react';
import { PLANNED_DATA_SOURCES } from '../data/mockData';
import { Database, GitFork, ArrowDown, ExternalLink, ShieldCheck, Cpu } from 'lucide-react';

export const DataMethods: React.FC = () => {
  const pipelineSteps = [
    { title: 'User Location Selection', desc: 'Arbitrary latitude (-90° to +90°) and longitude (-180° to +180°) acquisition via orthographic sphere or manual entry.' },
    { title: 'Terrain Data Discovery', desc: 'Queries LOLA & Goddard high-res DEM tiles surrounding the selected topocentric point.' },
    { title: 'Celestial Position Calculation', desc: 'Evaluates solar and Earth ephemeris vectors using NAIF SPICE kernels (SPK/PCK/FK) in Moon-fixed frame.' },
    { title: 'Terrain Visibility Analysis', desc: 'Traces 360 azimuthal rays across elevation raster to compute topographic horizon mask profile.' },
    { title: 'Mission Assessment', desc: 'Integrates solar power continuity, battery sizing thresholds, and direct-to-Earth communication availability.' },
    { title: 'Scenario Comparison & Visualization', desc: 'Outputs interactive polar charts, mission operational timelines, and multi-site comparative trade matrices.' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-900/30 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              METHODOLOGY ARCHITECTURE
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-mono text-white tracking-wide">
              DATA SOURCES & SCIENTIFIC FOUNDATIONS
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Planned integration roadmap for NASA Planetary Data System (PDS) assets, NAIF SPICE kernels, and topographic horizon modeling.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 font-mono text-xs flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Status: Scientific Architecture Specification</span>
        </div>
      </div>

      {/* Simplified System Architecture Diagram Flow */}
      <div className="glass-panel p-6 rounded-xl border border-cyan-900/30 space-y-4">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
            LUNAVISTA Analytical Pipeline Flow
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          End-to-end data processing workflow from observer selection to mission assessment:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
          {pipelineSteps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-full bg-space-950/80 p-3.5 rounded-lg border border-cyan-900/40 text-center flex flex-col justify-between h-full relative group hover:border-cyan-400 transition-colors">
                <span className="text-[10px] font-mono text-cyan-400 font-bold mb-1">
                  STEP 0{idx + 1}
                </span>
                <div className="text-xs font-bold font-mono text-white leading-tight">
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-2 font-sans leading-relaxed">
                  {step.desc}
                </div>
              </div>
              {idx < pipelineSteps.length - 1 && (
                <div className="lg:hidden my-2 text-cyan-400">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Data Source Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              Planned Scientific Data Products & Systems
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">All integrations in Research/Design phase</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLANNED_DATA_SOURCES.map((source, index) => (
            <div
              key={index}
              className="glass-panel p-5 rounded-xl border border-cyan-900/30 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm font-mono text-white leading-snug">
                    {source.name}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded shrink-0 bg-space-950 text-cyan-300 border border-cyan-800/60">
                    {source.status}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-cyan-400/90 mt-1">
                  {source.instrument}
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Purpose</span>
                    <p className="text-slate-300 font-sans mt-0.5">{source.purpose}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Planned Role in LUNAVISTA</span>
                    <p className="text-slate-400 font-sans leading-relaxed mt-0.5">{source.plannedUse}</p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Spatial/Temporal Res:</span>
                <span className="text-white font-semibold">{source.resolution}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
