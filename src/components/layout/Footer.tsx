import React from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-space-950/80 py-8 px-4 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-amber-400/90 bg-amber-950/20 px-3 py-1.5 rounded border border-amber-900/40">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            DISCLAIMER: Early-stage conceptual prototype developed for NASA Space Apps Challenge 2026.
            All metrics and visualizations use illustrative synthetic datasets and are not validated for actual lunar mission navigation.
          </span>
        </div>

        <div className="text-right shrink-0">
          <div className="text-slate-300 font-semibold">LUNAVISTA Platform</div>
          <div className="text-[11px] text-slate-500">
            Open-source Mission Planning Architecture
          </div>
        </div>
      </div>
    </footer>
  );
};
