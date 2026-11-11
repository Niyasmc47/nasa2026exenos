import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LunarCoordinates } from '../../types';
import { PRESET_LANDING_SITES } from '../../data/mockData';
import { RotateCw, ZoomIn, ZoomOut, Compass, MapPin, Eye, Info } from 'lucide-react';

interface LunarGlobeProps {
  selectedCoords: LunarCoordinates;
  onSelectCoords: (coords: LunarCoordinates) => void;
}

export const LunarGlobe: React.FC<LunarGlobeProps> = ({ selectedCoords, onSelectCoords }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Globe rotation states (angles in radians)
  const [rotationX, setRotationX] = useState<number>(0.2); // pitch
  const [rotationY, setRotationY] = useState<number>(-0.4); // yaw (around polar axis)
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showMarkers, setShowMarkers] = useState<boolean>(true);
  const [hoveredPreset, setHoveredPreset] = useState<string | null>(null);

  // Handle auto-rotation
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotationY((prev) => prev + 0.005);
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate]);

  // Center on coordinates when changed externally
  useEffect(() => {
    // If selected coords change, optionally orient towards them smoothly
    const targetRotY = -(selectedCoords.longitude * Math.PI) / 180;
    const targetRotX = (selectedCoords.latitude * Math.PI) / 180;
    setRotationY(targetRotY);
    setRotationX(Math.max(-1.4, Math.min(1.4, targetRotX)));
  }, [selectedCoords.latitude, selectedCoords.longitude]);

  // Draw the 3D lunar orthographic sphere on Canvas
  const drawSphere = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.42;
    const radius = baseRadius * zoom;

    ctx.clearRect(0, 0, width, height);

    // Deep space glow behind Moon
    const haloGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.3);
    haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.08)');
    haloGrad.addColorStop(0.5, 'rgba(30, 58, 138, 0.04)');
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Clip to sphere for surface drawing
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    // Moon base surface gradient (dark basalt mare + bright anorthositic highlands)
    const baseGrad = ctx.createRadialGradient(
      centerX - radius * 0.35,
      centerY - radius * 0.35,
      radius * 0.1,
      centerX,
      centerY,
      radius
    );
    baseGrad.addColorStop(0, '#a1a8b8');
    baseGrad.addColorStop(0.3, '#64748b');
    baseGrad.addColorStop(0.7, '#334155');
    baseGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

    // Procedural features (crater rings, lunar mare patches) projected to sphere
    // Simulated lunar mare features (Oceanus Procellarum, Mare Imbrium, Mare Tranquillitatis, etc.)
    const mareFeatures = [
      { lat: 20, lon: -40, r: 0.32, name: 'Oceanus Procellarum' },
      { lat: 35, lon: -17, r: 0.22, name: 'Mare Imbrium' },
      { lat: 15, lon: 18, r: 0.18, name: 'Mare Tranquillitatis' },
      { lat: -5, lon: 30, r: 0.15, name: 'Mare Fecunditatis' },
      { lat: -85, lon: 0, r: 0.26, name: 'South Pole-Aitken Rim' },
      { lat: -70, lon: 120, r: 0.28, name: 'South Pole Ridge Complex' },
    ];

    mareFeatures.forEach((feat) => {
      const latRad = (feat.lat * Math.PI) / 180;
      const lonRad = (feat.lon * Math.PI) / 180;

      // 3D Cartesian coordinates on unit sphere
      const x0 = Math.cos(latRad) * Math.sin(lonRad);
      const y0 = Math.sin(latRad);
      const z0 = Math.cos(latRad) * Math.cos(lonRad);

      // Rotate around Y axis (longitude / yaw)
      const x1 = x0 * Math.cos(rotationY) + z0 * Math.sin(rotationY);
      const y1 = y0;
      const z1 = -x0 * Math.sin(rotationY) + z0 * Math.cos(rotationY);

      // Rotate around X axis (latitude / pitch)
      const x2 = x1;
      const y2 = y1 * Math.cos(rotationX) - z1 * Math.sin(rotationX);
      const z2 = y1 * Math.sin(rotationX) + z1 * Math.cos(rotationX);

      // Visible only on front hemisphere (z2 > 0)
      if (z2 > 0) {
        const px = centerX + x2 * radius;
        const py = centerY - y2 * radius;
        const pr = feat.r * radius * (0.6 + 0.4 * z2);

        const darkGrad = ctx.createRadialGradient(px, py, 0, px, py, pr);
        darkGrad.addColorStop(0, 'rgba(15, 23, 42, 0.7)');
        darkGrad.addColorStop(0.7, 'rgba(30, 41, 59, 0.45)');
        darkGrad.addColorStop(1, 'rgba(51, 65, 85, 0)');
        ctx.fillStyle = darkGrad;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw Craters with rim highlights
    const craters = [
      { lat: -89.5, lon: 0, r: 0.08, name: 'Shackleton' },
      { lat: -85.5, lon: 2, r: 0.12, name: 'Malapert' },
      { lat: -43.0, lon: -11.0, r: 0.1, name: 'Tycho' },
      { lat: 9.6, lon: -20.0, r: 0.09, name: 'Copernicus' },
      { lat: 41.0, lon: 0.0, r: 0.08, name: 'Archimedes' },
      { lat: -88.0, lon: -5.0, r: 0.09, name: 'Haworth' },
      { lat: -87.5, lon: -65.0, r: 0.08, name: 'Shoemaker' },
    ];

    craters.forEach((c) => {
      const latRad = (c.lat * Math.PI) / 180;
      const lonRad = (c.lon * Math.PI) / 180;

      const x0 = Math.cos(latRad) * Math.sin(lonRad);
      const y0 = Math.sin(latRad);
      const z0 = Math.cos(latRad) * Math.cos(lonRad);

      const x1 = x0 * Math.cos(rotationY) + z0 * Math.sin(rotationY);
      const y1 = y0;
      const z1 = -x0 * Math.sin(rotationY) + z0 * Math.cos(rotationY);

      const x2 = x1;
      const y2 = y1 * Math.cos(rotationX) - z1 * Math.sin(rotationX);
      const z2 = y1 * Math.sin(rotationX) + z1 * Math.cos(rotationX);

      if (z2 > 0) {
        const px = centerX + x2 * radius;
        const py = centerY - y2 * radius;
        const pr = c.r * radius;

        // Rim shadow
        ctx.strokeStyle = `rgba(15, 23, 42, ${0.7 * z2})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.stroke();

        // Rim bright crest opposite shadow
        ctx.strokeStyle = `rgba(226, 232, 240, ${0.6 * z2})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px - 1, py - 1, pr, Math.PI * 0.75, Math.PI * 1.75);
        ctx.stroke();
      }
    });

    // Draw Latitude and Longitude Grid Lines
    if (showGrid) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.lineWidth = 0.8;

      // Parallels of latitude (-80 to 80 in steps of 20)
      for (let lat = -80; lat <= 80; lat += 20) {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 5) {
          const latRad = (lat * Math.PI) / 180;
          const lonRad = (lon * Math.PI) / 180;

          const x0 = Math.cos(latRad) * Math.sin(lonRad);
          const y0 = Math.sin(latRad);
          const z0 = Math.cos(latRad) * Math.cos(lonRad);

          const x1 = x0 * Math.cos(rotationY) + z0 * Math.sin(rotationY);
          const y1 = y0;
          const z1 = -x0 * Math.sin(rotationY) + z0 * Math.cos(rotationY);

          const x2 = x1;
          const y2 = y1 * Math.cos(rotationX) - z1 * Math.sin(rotationX);
          const z2 = y1 * Math.sin(rotationX) + z1 * Math.cos(rotationX);

          if (z2 > 0) {
            const px = centerX + x2 * radius;
            const py = centerY - y2 * radius;
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Meridians of longitude (-180 to 180 in steps of 30)
      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 3) {
          const latRad = (lat * Math.PI) / 180;
          const lonRad = (lon * Math.PI) / 180;

          const x0 = Math.cos(latRad) * Math.sin(lonRad);
          const y0 = Math.sin(latRad);
          const z0 = Math.cos(latRad) * Math.cos(lonRad);

          const x1 = x0 * Math.cos(rotationY) + z0 * Math.sin(rotationY);
          const y1 = y0;
          const z1 = -x0 * Math.sin(rotationY) + z0 * Math.cos(rotationY);

          const x2 = x1;
          const y2 = y1 * Math.cos(rotationX) - z1 * Math.sin(rotationX);
          const z2 = y1 * Math.sin(rotationX) + z1 * Math.cos(rotationX);

          if (z2 > 0) {
            const px = centerX + x2 * radius;
            const py = centerY - y2 * radius;
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Lunar Equator & Prime Meridian highlighters
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
      ctx.lineWidth = 1.4;
      // Equator
      ctx.beginPath();
      let eqStarted = false;
      for (let lon = -180; lon <= 180; lon += 3) {
        const lonRad = (lon * Math.PI) / 180;
        const x0 = Math.sin(lonRad);
        const y0 = 0;
        const z0 = Math.cos(lonRad);

        const x1 = x0 * Math.cos(rotationY) + z0 * Math.sin(rotationY);
        const y1 = y0;
        const z1 = -x0 * Math.sin(rotationY) + z0 * Math.cos(rotationY);

        const x2 = x1;
        const y2 = y1 * Math.cos(rotationX) - z1 * Math.sin(rotationX);
        const z2 = y1 * Math.sin(rotationX) + z1 * Math.cos(rotationX);

        if (z2 > 0) {
          const px = centerX + x2 * radius;
          const py = centerY - y2 * radius;
          if (!eqStarted) {
            ctx.moveTo(px, py);
            eqStarted = true;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          eqStarted = false;
        }
      }
      ctx.stroke();
    }

    // Shading terminator gradient across limb
    const limbGrad = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
    limbGrad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
    limbGrad.addColorStop(0.35, 'rgba(0, 0, 0, 0.15)');
    limbGrad.addColorStop(0.8, 'rgba(255, 255, 255, 0.05)');
    limbGrad.addColorStop(1, 'rgba(255, 255, 255, 0.18)');
    ctx.fillStyle = limbGrad;
    ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

    ctx.restore(); // remove sphere clip

    // Sphere outer border rim
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw Candidate Preset Markers
    if (showMarkers) {
      PRESET_LANDING_SITES.forEach((site) => {
        const latRad = (site.latitude * Math.PI) / 180;
        const lonRad = (site.longitude * Math.PI) / 180;

        const x0 = Math.cos(latRad) * Math.sin(lonRad);
        const y0 = Math.sin(latRad);
        const z0 = Math.cos(latRad) * Math.cos(lonRad);

        const x1 = x0 * Math.cos(rotationY) + z0 * Math.sin(rotationY);
        const y1 = y0;
        const z1 = -x0 * Math.sin(rotationY) + z0 * Math.cos(rotationY);

        const x2 = x1;
        const y2 = y1 * Math.cos(rotationX) - z1 * Math.sin(rotationX);
        const z2 = y1 * Math.sin(rotationX) + z1 * Math.cos(rotationX);

        if (z2 > 0) {
          const px = centerX + x2 * radius;
          const py = centerY - y2 * radius;

          // Preset ring
          ctx.strokeStyle = '#38bdf8';
          ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Preset label
          ctx.fillStyle = '#94a3b8';
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText((site.name || 'Site').split(' ')[0], px + 8, py - 4);
        }
      });
    }

    // Draw Selected Coordinate Marker with crosshairs and glow
    {
      const latRad = (selectedCoords.latitude * Math.PI) / 180;
      const lonRad = (selectedCoords.longitude * Math.PI) / 180;

      const x0 = Math.cos(latRad) * Math.sin(lonRad);
      const y0 = Math.sin(latRad);
      const z0 = Math.cos(latRad) * Math.cos(lonRad);

      const x1 = x0 * Math.cos(rotationY) + z0 * Math.sin(rotationY);
      const y1 = y0;
      const z1 = -x0 * Math.sin(rotationY) + z0 * Math.cos(rotationY);

      const x2 = x1;
      const y2 = y1 * Math.cos(rotationX) - z1 * Math.sin(rotationX);
      const z2 = y1 * Math.sin(rotationX) + z1 * Math.cos(rotationX);

      if (z2 > 0) {
        const px = centerX + x2 * radius;
        const py = centerY - y2 * radius;

        // Target glowing ring
        const targetGrad = ctx.createRadialGradient(px, py, 2, px, py, 14);
        targetGrad.addColorStop(0, '#22c55e');
        targetGrad.addColorStop(0.5, 'rgba(34, 197, 94, 0.4)');
        targetGrad.addColorStop(1, 'rgba(34, 197, 94, 0)');
        ctx.fillStyle = targetGrad;
        ctx.beginPath();
        ctx.arc(px, py, 14, 0, Math.PI * 2);
        ctx.fill();

        // Pinpoint center dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();

        // Reticle crosshairs
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px - 14, py);
        ctx.lineTo(px - 5, py);
        ctx.moveTo(px + 5, py);
        ctx.lineTo(px + 14, py);
        ctx.moveTo(px, py - 14);
        ctx.lineTo(px, py - 5);
        ctx.moveTo(px, py + 5);
        ctx.lineTo(px, py + 14);
        ctx.stroke();

        // Target HUD Callout box
        ctx.fillStyle = 'rgba(6, 13, 31, 0.88)';
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 1;
        const labelText = `${selectedCoords.latitude.toFixed(2)}°, ${selectedCoords.longitude.toFixed(2)}°`;
        ctx.fillRect(px + 18, py - 20, 110, 24);
        ctx.strokeRect(px + 18, py - 20, 110, 24);

        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.fillText('TARGET ACTIVE', px + 24, py - 7);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(labelText, px + 24, py + 2);
      }
    }
  }, [rotationX, rotationY, zoom, showGrid, showMarkers, selectedCoords]);

  // Handle animation loop
  useEffect(() => {
    let animId: number;
    const render = () => {
      drawSphere();
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [drawSphere]);

  // Resize canvas to match display size
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
      drawSphere();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawSphere]);

  // Click on globe to set arbitrary coordinates!
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.42;
    const radius = baseRadius * zoom;

    const dx = clickX - centerX;
    const dy = -(clickY - centerY); // standard cartesian Y up
    const distSq = dx * dx + dy * dy;

    if (distSq <= radius * radius) {
      // Point is on the sphere! Compute 3D un-projected point
      const x2 = dx / radius;
      const y2 = dy / radius;
      const z2 = Math.sqrt(Math.max(0, 1 - x2 * x2 - y2 * y2));

      // Inverse rotate around X axis (pitch)
      const x1 = x2;
      const y1 = y2 * Math.cos(-rotationX) - z2 * Math.sin(-rotationX);
      const z1 = y2 * Math.sin(-rotationX) + z2 * Math.cos(-rotationX);

      // Inverse rotate around Y axis (yaw)
      const x0 = x1 * Math.cos(-rotationY) + z1 * Math.sin(-rotationY);
      const y0 = y1;
      const z0 = -x1 * Math.sin(-rotationY) + z1 * Math.cos(-rotationY);

      // Convert unit vector to lat/lon degrees
      const lat = (Math.asin(Math.max(-1, Math.min(1, y0))) * 180) / Math.PI;
      const lon = (Math.atan2(x0, z0) * 180) / Math.PI;

      // Check if clicked close to a known preset
      let foundPreset = PRESET_LANDING_SITES.find((p) => {
        const dLat = Math.abs(p.latitude - lat);
        const dLon = Math.abs(p.longitude - lon);
        return dLat < 4 && dLon < 4;
      });

      onSelectCoords({
        latitude: Math.round(lat * 1000) / 1000,
        longitude: Math.round(lon * 1000) / 1000,
        name: foundPreset ? foundPreset.name : 'Arbitrary Surface Site',
        region: foundPreset ? foundPreset.region : lat <= -80 ? 'Lunar South Pole Region' : 'Surface Basin',
        elevationMeters: foundPreset ? foundPreset.elevationMeters : Math.round(Math.sin(lat) * 1800)
      });
    }
  };

  // Mouse drag rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;

    setRotationY((prev) => prev + dx * 0.008);
    setRotationX((prev) => Math.max(-1.5, Math.min(1.5, prev - dy * 0.008)));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full h-[520px] rounded-lg overflow-hidden border border-cyan-900/30 bg-[#060c1d] flex flex-col justify-between">
      {/* Top HUD Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center space-x-2 bg-space-900/90 backdrop-blur-md px-3 py-1.5 rounded border border-cyan-800/40 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-cyan-300">ORTHOGRAPHIC LUNAR SPHERE</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 font-mono">DRAG TO ROTATE • CLICK ANYWHERE</span>
        </div>

        <div className="flex items-center space-x-1.5 pointer-events-auto">
          <button
            onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
            className="p-1.5 bg-space-900/80 hover:bg-space-800 text-slate-300 hover:text-cyan-400 rounded border border-slate-700/60 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
            className="p-1.5 bg-space-900/80 hover:bg-space-800 text-slate-300 hover:text-cyan-400 rounded border border-slate-700/60 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setRotationX(0.2);
              setRotationY(-0.4);
              setZoom(1.0);
            }}
            className="p-1.5 bg-space-900/80 hover:bg-space-800 text-slate-300 hover:text-cyan-400 rounded border border-slate-700/60 transition-colors"
            title="Reset Lunar View"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded border transition-colors ${
              autoRotate
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-space-900/80 text-slate-400 border-slate-700/60 hover:text-white'
            }`}
            title="Toggle Auto Rotation"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2 py-1 text-xs font-mono rounded border transition-colors ${
              showGrid
                ? 'bg-cyan-900/40 text-cyan-300 border-cyan-500/40'
                : 'bg-space-900/80 text-slate-400 border-slate-700/60'
            }`}
          >
            GRID
          </button>
          <button
            onClick={() => setShowMarkers(!showMarkers)}
            className={`px-2 py-1 text-xs font-mono rounded border transition-colors ${
              showMarkers
                ? 'bg-cyan-900/40 text-cyan-300 border-cyan-500/40'
                : 'bg-space-900/80 text-slate-400 border-slate-700/60'
            }`}
          >
            SITES
          </button>
        </div>
      </div>

      {/* Interactive Canvas container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-crosshair select-none relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full block"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Bottom HUD Quick Preset Strip */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-auto bg-space-950/85 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800/80">
        <div className="flex items-center space-x-2">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
            Quick Candidates:
          </span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto py-0.5">
          {PRESET_LANDING_SITES.slice(0, 4).map((site) => (
            <button
              key={site.name}
              onClick={() => onSelectCoords(site)}
              className={`px-2 py-1 text-xs font-mono rounded transition-colors whitespace-nowrap ${
                Math.abs(selectedCoords.latitude - site.latitude) < 0.1 &&
                Math.abs(selectedCoords.longitude - site.longitude) < 0.1
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  : 'bg-space-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {(site.name || 'Site').split(' ')[0]} ({site.latitude.toFixed(1)}°)
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
