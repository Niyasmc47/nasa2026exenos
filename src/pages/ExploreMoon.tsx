import React, { useState } from 'react';
import { LunarGlobe } from '../components/moon/LunarGlobe';
import { LunarCoordinates, TerrainDetails } from '../types';
import { PRESET_LANDING_SITES, getSimulatedTerrain } from '../data/mockData';
import { MapPin, Navigation, Mountain, Layers, AlertCircle, CheckCircle2, ArrowRight, RefreshCw, Sliders } from 'lucide-react';
import { PageId } from '../components/layout/Navbar';

interface ExploreMoonProps {
  selectedCoords: LunarCoordinates;
  onSelectCoords: (coords: LunarCoordinates) => void;
  onNavigate: (page: PageId) => void;
  onAddToCompare: (coords: LunarCoordinates) => void;
}

export const ExploreMoon: React.FC<ExploreMoonProps> = ({
  selectedCoords,
  onSelectCoords,
  onNavigate,
  onAddToCompare,
}) => {
  // Manual input state
  const [latInput, setLatInput] = useState<string>(selectedCoords.latitude.toString());
  const [lonInput, setLonInput] = useState<string>(selectedCoords.longitude.toString());
  const [validationError, setValidationError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync inputs when globe click changes coords
  React.useEffect(() => {
    setLatInput(selectedCoords.latitude.toString());
    setLonInput(selectedCoords.longitude.toString());
    setValidationError(null);
  }, [selectedCoords]);

  const terrain: TerrainDetails = getSimulatedTerrain(selectedCoords.latitude, selectedCoords.longitude);

  const handleApplyCoordinates = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(latInput);
    const lon = parseFloat(lonInput);

    if (isNaN(lat) || isNaN(lon)) {
      setValidationError('Please enter valid numeric decimal coordinates.');
      return;
    }

    if (lat < -90 || lat > 90) {
      setValidationError('Latitude must be between -90.0° and +90.0°.');
      return;
    }

    if (lon < -180 || lon > 180) {
      setValidationError('Longitude must be between -180.0° and +180.0°.');
      return;
    }

    setValidationError(null);
    onSelectCoords({
      latitude: lat,
      longitude: lon,
      name: `Custom Coordinate (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
      region: lat <= -80 ? 'Lunar South Pole Area' : lat >= 80 ? 'Lunar North Pole Area' : 'Lunar Surface',
      elevationMeters: terrain.elevationM
    });

    setToastMessage(`Selected coordinates ${lat.toFixed(3)}°, ${lon.toFixed(3)}°`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearSelection = () => {
    onSelectCoords(PRESET_LANDING_SITES[0]);
    setToastMessage('Reset to Shackleton Crater Rim');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-900/30 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              EXPLORATION MODULE
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-mono text-white tracking-wide">
              LUNAR SURFACE NAVIGATOR
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Orthographic sphere visualization with arbitrary coordinate acquisition and local terrain profiling.
          </p>
        </div>

        {/* Action quick links */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAddToCompare(selectedCoords)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-space-900 hover:bg-space-800 text-cyan-300 border border-cyan-800/60 transition-colors flex items-center space-x-1"
          >
            <span>+ Add to Comparison</span>
          </button>
          <button
            onClick={() => onNavigate('planner')}
            className="px-3 py-1.5 rounded-lg text-xs font-mono bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center space-x-1.5 shadow-lg shadow-cyan-950 transition-colors"
          >
            <span>Configure Mission</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-4 py-2 rounded-lg text-xs font-mono flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Grid: Globe on Left, Coordinate Controller & Terrain Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Globe Section (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-2 rounded-xl">
            <LunarGlobe
              selectedCoords={selectedCoords}
              onSelectCoords={onSelectCoords}
            />
          </div>

          {/* Quick preset selector cards */}
          <div className="glass-panel p-4 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-300 uppercase flex items-center space-x-1.5">
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span>Artemis & Scientific Benchmark Sites</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Click to focus</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {PRESET_LANDING_SITES.map((site) => {
                const isSelected =
                  Math.abs(selectedCoords.latitude - site.latitude) < 0.05 &&
                  Math.abs(selectedCoords.longitude - site.longitude) < 0.05;
                return (
                  <button
                    key={site.name}
                    onClick={() => onSelectCoords(site)}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs font-mono ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-md shadow-cyan-950'
                        : 'bg-space-900/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="font-semibold truncate text-cyan-300">{site.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {site.latitude.toFixed(2)}°, {site.longitude.toFixed(2)}°
                    </div>
                    <div className="text-[9px] text-slate-500 mt-1 truncate">
                      {site.region}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Coordinate Input & Location Details Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Arbitrary Coordinate Manual Input Panel */}
          <div className="glass-panel p-5 rounded-xl border border-cyan-900/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-sm text-white font-mono uppercase">
                  Arbitrary Coordinate Input
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClearSelection}
                className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center space-x-1"
                title="Reset coordinates"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Enter any arbitrary decimal coordinates on the Moon surface. The platform computes local terrain horizon obstructions and solar grazing paths.
            </p>

            <form onSubmit={handleApplyCoordinates} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">
                    Latitude (-90° to +90°)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="-90"
                      max="90"
                      value={latInput}
                      onChange={(e) => setLatInput(e.target.value)}
                      placeholder="-89.78"
                      className="w-full bg-space-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 outline-none"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-500">
                      DEG
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">
                    Longitude (-180° to +180°)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="-180"
                      max="180"
                      value={lonInput}
                      onChange={(e) => setLonInput(e.target.value)}
                      placeholder="129.78"
                      className="w-full bg-space-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 outline-none"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-500">
                      DEG
                    </span>
                  </div>
                </div>
              </div>

              {validationError && (
                <div className="p-2.5 rounded bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{validationError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold shadow-md shadow-cyan-950 transition-colors flex items-center justify-center space-x-2"
              >
                <MapPin className="w-4 h-4" />
                <span>UPDATE COORDINATES</span>
              </button>
            </form>
          </div>

          {/* Location Details Panel */}
          <div className="glass-panel p-5 rounded-xl border border-cyan-900/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Mountain className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-sm text-white font-mono uppercase">
                  Location Topography Details
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                ILLUSTRATIVE DATA
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase">Target Site Identity</span>
                <div className="text-base font-bold font-mono text-white mt-0.5">
                  {selectedCoords.name || 'Arbitrary Selected Location'}
                </div>
                <div className="text-xs text-cyan-400 font-mono">
                  {selectedCoords.region || 'Lunar Surface Coordinate'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                <div className="bg-space-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Elevation</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {terrain.elevationM > 0 ? `+${terrain.elevationM}` : terrain.elevationM} m
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">ref 1737.4 km radius</span>
                </div>

                <div className="bg-space-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Local Slope</span>
                  <span className={`text-sm font-bold font-mono ${terrain.slopeDegrees > 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {terrain.slopeDegrees}°
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    {terrain.slopeDegrees > 15 ? 'Caution: Steep' : 'Safe for Lander'}
                  </span>
                </div>

                <div className="bg-space-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Surface Roughness</span>
                  <span className="text-sm font-bold font-mono text-white">
                    {terrain.roughnessM} m
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">Hurst exponent ~0.7</span>
                </div>

                <div className="bg-space-950/70 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Grid Resolution</span>
                  <span className="text-sm font-bold font-mono text-cyan-400">
                    {terrain.nominalResolutionM} m / px
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">LOLA Altimeter</span>
                </div>
              </div>

              {/* Data source and quality tags */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Terrain Dataset:</span>
                  <span className="text-slate-200 text-right truncate max-w-[200px]" title={terrain.sourceDataset}>
                    {terrain.sourceDataset.split('(')[0]}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Coverage Quality:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    terrain.qualityFlag === 'OPTIMAL'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    {terrain.qualityFlag} (Simulated)
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>DEM Uncertainty (1σ):</span>
                  <span className="text-slate-300">± {terrain.uncertaintyM} m</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => onNavigate('planner')}
                  className="flex-1 py-2 px-3 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>Plan Mission Here</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
