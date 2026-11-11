import React, { useState, useEffect, useRef } from 'react';
import { TimelineInterval } from '../../types';
import { Play, Pause, RotateCcw, Sun, Globe2, Zap, Radio, Clock, AlertTriangle } from 'lucide-react';

interface MissionTimelineProps {
  intervals: TimelineInterval[];
  selectedHour: number;
  onSelectHour: (hour: number | ((prev: number) => number)) => void;
  longestDarkness: number;
  longestBlackout: number;
}

export const MissionTimeline: React.FC<MissionTimelineProps> = ({
  intervals,
  selectedHour,
  onSelectHour,
  longestDarkness,
  longestBlackout,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Auto-play animation timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      onSelectHour((prev: number) => {
        const maxHour = intervals.length > 0 ? intervals[intervals.length - 1].hourOffset : 168;
        if (prev >= maxHour) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 2;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [isPlaying, intervals, onSelectHour]);

  // Current active interval
  const currentInterval = intervals.find((i) => i.hourOffset === selectedHour) || intervals[0] || {
    hourOffset: 0,
    timestamp: '2026-10-15 00:00',
    sunElevation: 2.1,
    earthElevation: 6.2,
    horizonHeight: 1.2,
    state: 'SUN_AND_EARTH',
    powerGenerationWatts: 560,
    commsBandwidthKbps: 2048,
  };

  const maxHour = intervals.length > 0 ? intervals[intervals.length - 1].hourOffset : 168;

  // Handle timeline scrubber click/drag
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetHour = Math.round((ratio * maxHour) / 2) * 2;
    onSelectHour(targetHour);
  };

  const getStateColor = (state: TimelineInterval['state']) => {
    switch (state) {
      case 'SUN_AND_EARTH':
        return 'bg-emerald-500 hover:bg-emerald-400';
      case 'SUN_ONLY':
        return 'bg-amber-500 hover:bg-amber-400';
      case 'EARTH_ONLY':
        return 'bg-sky-500 hover:bg-sky-400';
      case 'NEITHER':
        return 'bg-rose-950/80 border-t border-rose-500 hover:bg-rose-900';
    }
  };

  const getStateLabel = (state: TimelineInterval['state']) => {
    switch (state) {
      case 'SUN_AND_EARTH':
        return { text: 'Optimal (Sun + Earth Line-of-Sight)', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'SUN_ONLY':
        return { text: 'Power Only (Earth Obstructed by Terrain)', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'EARTH_ONLY':
        return { text: 'Comms Only (Lunar Night / Ridge Shadow)', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40' };
      case 'NEITHER':
        return { text: 'Critical Blackout & Eclipse State', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
    }
  };

  const activeLabel = getStateLabel(currentInterval.state);

  return (
    <div className="glass-panel p-5 rounded-xl border border-cyan-900/30 space-y-5">
      {/* Timeline Controls & Current Status */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-sm tracking-wide text-white uppercase">
              Mission Operational Timeline
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            T+ {selectedHour}h | {currentInterval.timestamp} UTC (Scrub or press play to simulate)
          </p>
        </div>

        {/* Player controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSelectHour(0)}
            className="p-1.5 rounded bg-space-900 hover:bg-space-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Reset to T+0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold shadow-lg shadow-cyan-900/40 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>SIMULATE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Scrubber Ribbon */}
      <div className="space-y-2">
        <div
          ref={trackRef}
          onClick={handleScrubberClick}
          className="relative h-12 w-full bg-space-950 rounded-lg overflow-hidden border border-slate-800 cursor-pointer flex"
        >
          {intervals.map((inter) => {
            const widthPct = (2 / maxHour) * 100;
            return (
              <div
                key={inter.hourOffset}
                style={{ width: `${widthPct}%` }}
                className={`h-full transition-opacity ${getStateColor(inter.state)} ${
                  inter.hourOffset === selectedHour ? 'opacity-100 ring-1 ring-white' : 'opacity-75'
                }`}
                title={`T+${inter.hourOffset}h: ${inter.state}`}
              />
            );
          })}

          {/* Movable Cursor Needle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none transition-all duration-75 flex flex-col items-center"
            style={{ left: `${(selectedHour / maxHour) * 100}%` }}
          >
            <div className="w-3 h-3 bg-white rounded-full -mt-1 shadow-md border border-cyan-600"></div>
            <div className="w-0.5 h-full bg-cyan-400"></div>
          </div>
        </div>

        {/* Date and Hour axis ticks */}
        <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
          <span>T+ 0h (Landing)</span>
          <span>T+ {Math.round(maxHour * 0.25)}h</span>
          <span>T+ {Math.round(maxHour * 0.5)}h</span>
          <span>T+ {Math.round(maxHour * 0.75)}h</span>
          <span>T+ {maxHour}h (End of Phase)</span>
        </div>
      </div>

      {/* State Color Key / Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="flex items-center space-x-2 bg-space-950/60 p-2 rounded border border-slate-800/60">
          <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
          <span className="text-slate-300">Sun + Earth Visible</span>
        </div>
        <div className="flex items-center space-x-2 bg-space-950/60 p-2 rounded border border-slate-800/60">
          <span className="w-3 h-3 rounded-sm bg-amber-500"></span>
          <span className="text-slate-300">Sunlight Only</span>
        </div>
        <div className="flex items-center space-x-2 bg-space-950/60 p-2 rounded border border-slate-800/60">
          <span className="w-3 h-3 rounded-sm bg-sky-500"></span>
          <span className="text-slate-300">Earth Visible Only</span>
        </div>
        <div className="flex items-center space-x-2 bg-space-950/60 p-2 rounded border border-slate-800/60">
          <span className="w-3 h-3 rounded-sm bg-rose-900 border border-rose-500"></span>
          <span className="text-slate-300">Total Blackout</span>
        </div>
      </div>

      {/* Current Cursor Telemetry Readout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-space-900/60 p-3 rounded-lg border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Operational State</div>
          <div className="text-xs font-medium text-white mt-1 truncate">
            {activeLabel.text.split('(')[0]}
          </div>
          <span className={`inline-block text-[10px] font-mono px-1.5 py-0.5 rounded border mt-1.5 ${activeLabel.badge}`}>
            {currentInterval.state}
          </span>
        </div>

        <div className="bg-space-900/60 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Simulated Solar Power</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold font-mono text-white mt-0.5">
            {currentInterval.powerGenerationWatts} <span className="text-xs font-normal text-slate-400">Watts</span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Sun elev: {currentInterval.sunElevation}° (horizon: {currentInterval.horizonHeight}°)
          </div>
        </div>

        <div className="bg-space-900/60 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Direct Earth Telemetry</span>
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold font-mono text-white mt-0.5">
            {currentInterval.commsBandwidthKbps > 0 ? '2.0 Mbps' : '0.0 Kbps'}
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Direct RF to DSN: {currentInterval.commsBandwidthKbps > 0 ? 'AVAILABLE' : 'BLOCKED'}
          </div>
        </div>

        <div className="bg-space-900/60 p-3 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Worst-Case Durations</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xs font-mono text-slate-200 mt-1.5 space-y-0.5">
            <div>Longest Darkness: <span className="text-amber-300 font-bold">{longestDarkness}h</span></div>
            <div>Max Blackout: <span className="text-rose-300 font-bold">{longestBlackout}h</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
