import React from 'react';
import { Compass, Calendar, GitCompare, BarChart3, Database, Info, Moon, Activity } from 'lucide-react';

export type PageId = 'explore' | 'planner' | 'compare' | 'analysis' | 'data' | 'about';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'explore', label: 'Explore Moon', icon: <Compass className="w-4 h-4" /> },
    { id: 'planner', label: 'Mission Planner', icon: <Calendar className="w-4 h-4" /> },
    { id: 'compare', label: 'Compare Scenarios', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'analysis', label: 'Analysis & Uncertainty', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'data', label: 'Data & Methods', icon: <Database className="w-4 h-4" /> },
    { id: 'about', label: 'About LUNAVISTA', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#030712]/90 backdrop-blur-md border-b border-cyan-900/30">
      {/* Top Banner with Prototype Notice */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-space-900 to-cyan-950/60 border-b border-cyan-950 px-4 py-1 flex items-center justify-between text-[11px] font-mono text-cyan-400">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span>NASA Space Apps Challenge 2026 — Prototype</span>
        </div>
        <div className="flex items-center space-x-3 text-slate-400">
          <span className="hidden sm:inline">Illustrative demo data — scientific calculations not yet integrated</span>
          <span className="text-emerald-400 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>SYSTEM ONLINE</span>
          </span>
        </div>
      </div>

      {/* Main Header / Navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div 
            onClick={() => onNavigate('explore')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600/30 to-blue-900/40 border border-cyan-500/40 flex items-center justify-center group-hover:border-cyan-400 transition-colors shadow-lg shadow-cyan-950/50">
              <Moon className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-wider text-white font-mono">
                  LUNA<span className="text-cyan-400">VISTA</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  v0.1 PREVIEW
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-tight hidden md:block">
                Terrain-Aware Lunar Landing Site Evaluation & Mission Planning Platform
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 overflow-x-auto py-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-900/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-space-800/60 border border-transparent'
                  }`}
                >
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
