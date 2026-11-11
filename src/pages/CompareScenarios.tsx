import React, { useState } from 'react';
import { ScenarioComparisonItem, LunarCoordinates } from '../types';
import { INITIAL_SCENARIOS, PRESET_LANDING_SITES } from '../data/mockData';
import { Plus, Trash2, GitCompare, BarChart2, Check, ArrowUpRight, ArrowDownRight, Sparkles, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface CompareScenariosProps {
  scenarios: ScenarioComparisonItem[];
  onAddScenario: (scenario: ScenarioComparisonItem) => void;
  onRemoveScenario: (id: string) => void;
}

export const CompareScenarios: React.FC<CompareScenariosProps> = ({
  scenarios,
  onAddScenario,
  onRemoveScenario,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newScenarioName, setNewScenarioName] = useState<string>('Scenario D: Peak of Eternal Light candidate');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [durationDays, setDurationDays] = useState<number>(7);

  const handleCreateScenario = (e: React.FormEvent) => {
    e.preventDefault();
    const preset = PRESET_LANDING_SITES[selectedPresetIndex];
    const newId = `sc-${Date.now()}`;
    
    // Deterministic pseudo metrics based on latitude
    const sunAvail = Math.abs(preset.latitude) >= 88 ? 84.5 : 50.0;
    const earthAvail = Math.abs(preset.latitude) >= 85 ? 93.0 : 70.0;

    const newScenario: ScenarioComparisonItem = {
      id: newId,
      name: newScenarioName,
      coords: { ...preset },
      date: '2026-10-15',
      durationDays: durationDays,
      observerHeightM: 2.5,
      metrics: {
        sunlightAvailabilityPct: sunAvail,
        earthVisibilityPct: earthAvail,
        longestDarknessHours: sunAvail > 70 ? 11.0 : 48.0,
        longestCommBlackoutHours: earthAvail > 85 ? 3.5 : 24.0,
        maxContinuousSunHours: 52.0,
        maxContinuousEarthHours: 110.0,
        terrainResolutionM: 5.0,
        confidenceScore: 88,
      },
      highlights: [
        `Targeted at ${preset.name} (${preset.latitude.toFixed(2)}°)`,
        'Demonstration profile with synthetic topographic obstruction',
      ],
    };

    onAddScenario(newScenario);
    setShowAddModal(false);
  };

  // Prepare chart data comparing scenarios
  const chartData = scenarios.map((sc) => ({
    name: sc.name.split(':')[0],
    fullName: sc.name,
    'Sunlight Availability (%)': sc.metrics.sunlightAvailabilityPct,
    'Earth Line-of-Sight (%)': sc.metrics.earthVisibilityPct,
  }));

  const chartDataHours = scenarios.map((sc) => ({
    name: sc.name.split(':')[0],
    'Longest Darkness (hrs)': sc.metrics.longestDarknessHours,
    'Max Comm Blackout (hrs)': sc.metrics.longestCommBlackoutHours,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-900/30 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              TRADE STUDY MODULE
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-mono text-white tracking-wide">
              MULTI-SCENARIO COMPARISON MATRIX
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate mission trade-offs between candidate landing coordinates, power continuity, and direct-to-Earth telemetry windows.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-1.5 rounded-lg text-xs font-mono bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center space-x-1.5 shadow-lg shadow-cyan-950 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>ADD SCENARIO</span>
        </button>
      </div>

      {/* Side-by-side Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((sc, index) => (
          <div
            key={sc.id}
            className="glass-panel p-5 rounded-xl border border-cyan-900/30 relative flex flex-col justify-between hover:border-cyan-500/40 transition-all space-y-4"
          >
            <div>
              {/* Card Title & Delete */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">
                    OPTION {index + 1}
                  </span>
                  <h3 className="text-sm font-bold font-mono text-white mt-0.5 leading-snug">
                    {sc.name}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    {sc.coords.latitude.toFixed(2)}° Lat, {sc.coords.longitude.toFixed(2)}° Lon
                  </div>
                </div>

                {scenarios.length > 1 && (
                  <button
                    onClick={() => onRemoveScenario(sc.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-space-900 transition-colors"
                    title="Remove scenario"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-space-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Solar Sun</span>
                  <span className="text-base font-bold font-mono text-amber-300">
                    {sc.metrics.sunlightAvailabilityPct}%
                  </span>
                  <span className="text-[9px] text-slate-500 block font-mono">availability</span>
                </div>

                <div className="bg-space-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Earth DSN</span>
                  <span className="text-base font-bold font-mono text-cyan-300">
                    {sc.metrics.earthVisibilityPct}%
                  </span>
                  <span className="text-[9px] text-slate-500 block font-mono">line-of-sight</span>
                </div>

                <div className="bg-space-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Max Darkness</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {sc.metrics.longestDarknessHours} h
                  </span>
                  <span className="text-[9px] text-slate-500 block font-mono">continuous</span>
                </div>

                <div className="bg-space-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Max Blackout</span>
                  <span className="text-sm font-bold font-mono text-rose-300">
                    {sc.metrics.longestCommBlackoutHours} h
                  </span>
                  <span className="text-[9px] text-slate-500 block font-mono">continuous</span>
                </div>
              </div>

              {/* Scenario Qualitative Highlights */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Engineering Assessment
                </span>
                {sc.highlights.map((h, i) => (
                  <div key={i} className="flex items-start space-x-1.5 text-xs text-slate-300">
                    <span className="text-cyan-400 font-mono mt-0.5">•</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Tag */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>DEM Res: {sc.metrics.terrainResolutionM}m</span>
              <span className="text-emerald-400">Confidence {sc.metrics.confidenceScore}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Graphs Section (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Availability Bar Chart */}
        <div className="glass-panel p-5 rounded-xl border border-cyan-900/30 space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm text-white font-mono uppercase">
              Resource Availability Comparison (% of Mission Window)
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#060d1f',
                    borderColor: '#0e7490',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Bar dataKey="Sunlight Availability (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Earth Line-of-Sight (%)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Worst-Case Outages Bar Chart */}
        <div className="glass-panel p-5 rounded-xl border border-cyan-900/30 space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-rose-400" />
            <h3 className="font-semibold text-sm text-white font-mono uppercase">
              Worst-Case Outages (Continuous Hours)
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataHours} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#060d1f',
                    borderColor: '#991b1b',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Bar dataKey="Longest Darkness (hrs)" fill="#ea580c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Max Comm Blackout (hrs)" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* "What Changed?" Analytical Synthesis Section */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-900/40 space-y-3">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Sparkles className="w-4 h-4" />
          <h3 className="font-semibold text-sm font-mono uppercase tracking-wide">
            Automated Trade-Off Analysis ("What Changed?")
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-space-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="font-mono text-cyan-300 font-semibold">Power vs. Telemetry Trade:</span>
            <p className="leading-relaxed text-slate-400">
              Scenario A (Shackleton Rim Alpha) offers the highest continuous solar availability (86.4%) due to its elevated ridge crest, keeping max darkness to under 8.5 hours. However, Scenario B (Malapert Peak Mountain) provides superior direct Earth elevation (+98.6% window), virtually eliminating telecommunication blackouts.
            </p>
          </div>
          <div className="bg-space-950/70 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="font-mono text-amber-300 font-semibold">Volatile Access Penalty:</span>
            <p className="leading-relaxed text-slate-400">
              Scenario C (Haworth PSR Basin Flank) sits directly adjacent to permanently shadowed ice deposits, but incurs a severe 58-hour darkness duration and requires significant secondary battery mass or a dedicated orbital relay.
            </p>
          </div>
        </div>
      </div>

      {/* Add Scenario Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-cyan-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm font-mono text-white uppercase">Add Comparison Scenario</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateScenario} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Scenario Label</label>
                <input
                  type="text"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  className="w-full bg-space-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Target Surface Site</label>
                <select
                  value={selectedPresetIndex}
                  onChange={(e) => setSelectedPresetIndex(Number(e.target.value))}
                  className="w-full bg-space-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
                >
                  {PRESET_LANDING_SITES.map((site, idx) => (
                    <option key={site.name} value={idx}>
                      {site.name} ({site.latitude.toFixed(2)}°, {site.longitude.toFixed(2)}°)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Mission Duration</label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full bg-space-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400"
                >
                  <option value={7}>7 Earth Days</option>
                  <option value={14}>14 Earth Days</option>
                  <option value={28}>28 Earth Days</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-mono bg-space-900 text-slate-300 hover:text-white border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-mono bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-md shadow-cyan-950"
                >
                  Add Scenario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
