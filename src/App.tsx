import React, { useState } from 'react';
import { Navbar, PageId } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ExploreMoon } from './pages/ExploreMoon';
import { MissionPlanner } from './pages/MissionPlanner';
import { CompareScenarios } from './pages/CompareScenarios';
import { AnalysisUncertainty } from './pages/AnalysisUncertainty';
import { DataMethods } from './pages/DataMethods';
import { About } from './pages/About';
import { LunarCoordinates, ScenarioComparisonItem } from './types';
import { PRESET_LANDING_SITES, INITIAL_SCENARIOS } from './data/mockData';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('explore');
  const [selectedCoords, setSelectedCoords] = useState<LunarCoordinates>(PRESET_LANDING_SITES[0]);
  const [scenarios, setScenarios] = useState<ScenarioComparisonItem[]>(INITIAL_SCENARIOS);

  // Add custom coordinate as a new scenario for comparison
  const handleAddToCompare = (coords: LunarCoordinates) => {
    const isPolar = Math.abs(coords.latitude) >= 80;
    const sunAvail = isPolar ? 82.5 : 50.0;
    const earthAvail = isPolar ? 91.0 : 75.0;

    const newScenario: ScenarioComparisonItem = {
      id: `sc-${Date.now()}`,
      name: coords.name ? `Site: ${coords.name}` : `Coord (${coords.latitude.toFixed(2)}°, ${coords.longitude.toFixed(2)}°)`,
      coords: { ...coords },
      date: '2026-10-15',
      durationDays: 7,
      observerHeightM: 2.5,
      metrics: {
        sunlightAvailabilityPct: sunAvail,
        earthVisibilityPct: earthAvail,
        longestDarknessHours: isPolar ? 12.0 : 56.0,
        longestCommBlackoutHours: isPolar ? 5.0 : 20.0,
        maxContinuousSunHours: 48.0,
        maxContinuousEarthHours: 92.0,
        terrainResolutionM: isPolar ? 5.0 : 30.0,
        confidenceScore: 90,
      },
      highlights: [
        `Coordinates: ${coords.latitude.toFixed(2)}° Lat, ${coords.longitude.toFixed(2)}° Lon`,
        coords.region || 'Lunar surface location',
        'Simulated terrain elevation masking applied',
      ],
    };

    setScenarios((prev) => [...prev, newScenario]);
    setCurrentPage('compare');
  };

  const handleRemoveScenario = (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddScenario = (scenario: ScenarioComparisonItem) => {
    setScenarios((prev) => [...prev, scenario]);
  };

  return (
    <div className="min-h-screen space-bg flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      <div>
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          {currentPage === 'explore' && (
            <ExploreMoon
              selectedCoords={selectedCoords}
              onSelectCoords={setSelectedCoords}
              onNavigate={setCurrentPage}
              onAddToCompare={handleAddToCompare}
            />
          )}

          {currentPage === 'planner' && (
            <MissionPlanner
              currentCoords={selectedCoords}
              onUpdateCoords={setSelectedCoords}
              onAddToCompare={handleAddToCompare}
            />
          )}

          {currentPage === 'compare' && (
            <CompareScenarios
              scenarios={scenarios}
              onAddScenario={handleAddScenario}
              onRemoveScenario={handleRemoveScenario}
            />
          )}

          {currentPage === 'analysis' && <AnalysisUncertainty />}

          {currentPage === 'data' && <DataMethods />}

          {currentPage === 'about' && <About />}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default App;
