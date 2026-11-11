import React, { useState, useMemo } from 'react';
import { LunarCoordinates, TimelineInterval } from '../types';
import { PRESET_LANDING_SITES, generateTimelineData, getSimulatedTerrain } from '../data/mockData';
import { SkyPolarChart } from '../components/mission/SkyPolarChart';
import { MissionTimeline } from '../components/mission/MissionTimeline';
import { Play, Calendar, Clock, Compass, Layers, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';

interface MissionPlannerProps {
  currentCoords: LunarCoordinates;
  onUpdateCoords: (coords: LunarCoordinates) => void;
  onAddToCompare: (coords: LunarCoordinates) => void;
}

export const MissionPlanner: React.FC<MissionPlannerProps> = ({
  currentCoords,
  onUpdateCoords,
  onAddToCompare,
}) => {
  // Mission Configuration state
  const [landingDate, setLandingDate] = useState<string>('2026-10-15');
  const [landingTime, setLandingTime] = useState<string>('08:00');
  const [durationDays, setDurationDays] = useState<number>(7);
  const [observerHeightM, setObserverHeightM] = useState<number>(2.5);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisTimestamp, setAnalysisTimestamp] = useState<string>('Just now');
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [skyView, setSkyView] = useState<'COMBINED' | 'SUN' | 'EARTH'>('COMBINED');

  // Input fields for coordinates
  const [latInput, setLatInput] = useState<string>(currentCoords.latitude.toString());
  const [lonInput, setLonInput] = useState<string>(currentCoords.longitude.toString());

  // Generate simulated timeline intervals based on inputs
  const timelineIntervals: TimelineInterval[] = useMemo(() => {
    return generateTimelineData(durationDays, currentCoords.latitude);
  }, [durationDays, currentCoords.latitude]);

  // Longest darkness and blackout calculations from intervals
  const { longestDarkness, longestBlackout, sunAvailabilityPct, earthVisibilityPct } = useMemo(() => {
    let maxDark = 0;
    let currDark = 0;
    let maxBlackout = 0;
    let currBlackout = 0;
    let sunCount = 0;
    let earthCount = 0;

    timelineIntervals.forEach((item) => {
      if (item.state === 'SUN_AND_EARTH' || item.state === 'SUN_ONLY') {
        sunCount++;
        currDark = 0;
      } else {
        currDark += 2;
        if (currDark > maxDark) maxDark = currDark;
      }

      if (item.state === 'SUN_AND_EARTH' || item.state === 'EARTH_ONLY') {
        earthCount++;
        currBlackout = 0;
      } else {
        currBlackout += 2;
        if (currBlackout > maxBlackout) maxBlackout = currBlackout;
      }
    });

    const total = timelineIntervals.length || 1;
    return {
      longestDarkness: maxDark,
      longestBlackout: maxBlackout,
      sunAvailabilityPct: Math.round((sunCount / total) * 1000) / 10,
      earthVisibilityPct: Math.round((earthCount / total) * 1000) / 10,
    };
  }, [timelineIntervals]);

  // Current interval based on scrubber
  const currentInterval = timelineIntervals.find((i) => i.hourOffset === selectedHour) || timelineIntervals[0];

  // Simulated analysis action
  const handleAnalyzeMission = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisTimestamp(new Date().toLocaleTimeString());
    }, 600);
  };

  const handleApplyCoords = () => {
    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      onUpdateCoords({
        latitude: lat,
        longitude: lon,
        name: `Mission Site (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
        region: lat <= -80 ? 'Lunar South Pole' : 'Lunar Surface'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-900/30 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              MISSION ARCHITECTURE
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-mono text-white tracking-wide">
              LUNAR MISSION PLANNER & TIMELINE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate topocentric solar illumination and direct Earth line-of-sight across candidate mission time horizons.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAddToCompare(currentCoords)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-space-900 hover:bg-space-800 text-cyan-300 border border-cyan-800/60 transition-colors"
          >
            + Add to Comparison
          </button>
          <button
            onClick={handleAnalyzeMission}
            disabled={isAnalyzing}
            className="px-4 py-1.5 rounded-lg text-xs font-mono bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center space-x-2 shadow-lg shadow-cyan-950 transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isAnalyzing ? 'COMPUTING RAYS...' : 'ANALYZE MISSION'}</span>
          </button>
        </div>
      </div>

      {/* Top Configuration & Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Configuration Panel (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-xl border border-cyan-900/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-semibold text-sm text-white font-mono uppercase flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Mission Configuration Parameters</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">DEMO RUNNER</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Latitude input */}
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                Latitude (-90° to +90°)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="any"
                  value={latInput}
                  onChange={(e) => setLatInput(e.target.value)}
                  className="w-full bg-space-950 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none"
                />
              </div>
            </div>

            {/* Longitude input */}
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                Longitude (-180° to +180°)
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="any"
                  value={lonInput}
                  onChange={(e) => setLonInput(e.target.value)}
                  className="w-full bg-space-950 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none"
                />
                <button
                  onClick={handleApplyCoords}
                  className="px-2.5 py-1.5 bg-space-900 hover:bg-space-800 text-cyan-300 border border-slate-700 rounded-lg text-xs font-mono shrink-0"
                >
                  Set
                </button>
              </div>
            </div>

            {/* Landing Date */}
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                Landing Date (UTC)
              </label>
              <input
                type="date"
                value={landingDate}
                onChange={(e) => setLandingDate(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none"
              />
            </div>

            {/* Landing Time */}
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                Landing Time (UTC)
              </label>
              <input
                type="time"
                value={landingTime}
                onChange={(e) => setLandingTime(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none"
              />
            </div>

            {/* Mission Duration */}
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                Mission Duration
              </label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full bg-space-950 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none"
              >
                <option value={3}>3 Earth Days (Short Sortie)</option>
                <option value={7}>7 Earth Days (Standard Artemis Sortie)</option>
                <option value={14}>14 Earth Days (Full Lunar Daylight Half-Cycle)</option>
                <option value={28}>28 Earth Days (Full Lunar Synodic Month)</option>
              </select>
            </div>

            {/* Observer Mast Height */}
            <div>
              <label className="block text-[11px] font-mono text-slate-300 mb-1">
                Observer Antenna / Solar Mast Height
              </label>
              <select
                value={observerHeightM}
                onChange={(e) => setObserverHeightM(Number(e.target.value))}
                className="w-full bg-space-950 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none"
              >
                <option value={1.5}>1.5 m (Micro-Rover / CLPS small lander)</option>
                <option value={2.5}>2.5 m (Medium Lander solar array)</option>
                <option value={5.0}>5.0 m (Artemis Human Landing System mast)</option>
                <option value={10.0}>10.0 m (Deployable Polar Tower)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mission Status Summary Card (5 cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-xl border border-cyan-900/30 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-semibold text-sm text-white font-mono uppercase flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Simulated Mission Assessment</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Updated: {analysisTimestamp}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-space-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Solar Availability</span>
                <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                  {sunAvailabilityPct}%
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  of mission duration
                </div>
              </div>

              <div className="bg-space-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Earth RF Visibility</span>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-1">
                  {earthVisibilityPct}%
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  direct line-of-sight
                </div>
              </div>

              <div className="bg-space-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Max Continuous Darkness</span>
                <div className="text-xl font-bold font-mono text-slate-200 mt-1">
                  {longestDarkness} <span className="text-xs font-normal text-slate-400">hours</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  battery sizing constraint
                </div>
              </div>

              <div className="bg-space-950/70 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Max Comm Blackout</span>
                <div className="text-xl font-bold font-mono text-rose-300 mt-1">
                  {longestBlackout} <span className="text-xs font-normal text-slate-400">hours</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                  autonomous ops window
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
            <span>LOCATION: {currentCoords.latitude.toFixed(2)}°, {currentCoords.longitude.toFixed(2)}°</span>
            <span className="text-slate-400">ALT: {currentCoords.elevationMeters || 1240}m</span>
          </div>
        </div>
      </div>

      {/* Local Sky Polar Chart Visualization */}
      <div>
        <SkyPolarChart
          sunAzimuth={142.5 + (selectedHour * 0.5) % 360}
          sunElevation={currentInterval.sunElevation}
          earthAzimuth={28.2 + (selectedHour * 0.1) % 360}
          earthElevation={currentInterval.earthElevation}
          activeView={skyView}
          onViewChange={setSkyView}
        />
      </div>

      {/* Mission Operational Timeline */}
      <div>
        <MissionTimeline
          intervals={timelineIntervals}
          selectedHour={selectedHour}
          onSelectHour={setSelectedHour}
          longestDarkness={longestDarkness}
          longestBlackout={longestBlackout}
        />
      </div>
    </div>
  );
};
