"use client";

import { useCallback, useMemo, useState } from "react";
import { ARTEMIS_III_REGIONS, type PSRRecord } from "@/data/psr-south-pole";
import { computeIceAccess } from "@/lib/ice-access";
import type { IceAccessResult } from "@/lib/ice-access";
import { COLOR_HIGH_ICE, COLOR_PSR, COLOR_HIGH_ICE_RGBA, COLOR_PSR_RGBA } from "@/lib/globe-colors";

const MAP_SIZE = 520;
const SOUTH_EDGE_LAT = -80;
const POLE_LAT = -90;
/** Scale: pixels per degree of latitude from pole */
const SCALE = (MAP_SIZE / 2) / (POLE_LAT - SOUTH_EDGE_LAT);

/** Convert lunar (lat, lon) to SVG x,y. South Pole at center, lat -90 = center. */
function latLonToXY(lat: number, lon: number): { x: number; y: number } {
  const r = (lat - POLE_LAT) * SCALE;
  const rad = (lon * Math.PI) / 180;
  const x = MAP_SIZE / 2 + r * Math.sin(rad);
  const y = MAP_SIZE / 2 - r * Math.cos(rad);
  return { x, y };
}

/** Radius on map for a PSR (from area ~ pi*r^2, so r_km = sqrt(area/pi)); scale to pixels */
function psrRadiusPx(areaKm2: number): number {
  const rKm = Math.sqrt(areaKm2 / Math.PI);
  const degPerKm = 1 / 30.5;
  const rDeg = rKm * degPerKm;
  return Math.max(4, rDeg * SCALE);
}

interface SouthPoleMapProps {
  psrs: PSRRecord[];
  onSelectSite: (lat: number, lon: number, result: IceAccessResult) => void;
  selectedLat: number | null;
  selectedLon: number | null;
  /** Show only ice-priority PSRs */
  showIceOnly?: boolean;
  /** Show Artemis III region markers */
  showArtemis?: boolean;
}

export function SouthPoleMap({
  psrs,
  onSelectSite,
  selectedLat,
  selectedLon,
  showIceOnly = false,
  showArtemis = true,
}: SouthPoleMapProps) {
  const [hoverPsr, setHoverPsr] = useState<PSRRecord | null>(null);

  const handleMapClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const cx = MAP_SIZE / 2;
      const cy = MAP_SIZE / 2;
      const dx = px - cx;
      const dy = py - cy;
      const rPx = Math.sqrt(dx * dx + dy * dy);
      const rDeg = rPx / SCALE;
      const lat = POLE_LAT + rDeg;
      const lon = (Math.atan2(dx, -dy) * 180) / Math.PI;
      const lonNorm = ((lon % 360) + 360) % 360;
      if (lat > SOUTH_EDGE_LAT) return;
      const result = computeIceAccess(lat, lonNorm, 30, psrs);
      onSelectSite(lat, lonNorm, result);
    },
    [onSelectSite, psrs]
  );

  const psrCircles = useMemo(() => {
    const list = showIceOnly ? psrs.filter((p) => p.icePriority) : psrs;
    return list.map((psr) => {
      const { x, y } = latLonToXY(psr.lat, psr.lon);
      const r = psrRadiusPx(psr.areaKm2);
      return { psr, x, y, r };
    });
  }, [psrs, showIceOnly]);

  const artemisPoints = useMemo(() => {
    return ARTEMIS_III_REGIONS.map((r) => ({
      ...r,
      ...latLonToXY(r.lat, r.lon),
    }));
  }, []);

  const selectedXY =
    selectedLat != null && selectedLon != null
      ? latLonToXY(selectedLat, selectedLon)
      : null;

  const poleEdgePath = useMemo(() => {
    const points: string[] = [];
    for (let lon = 0; lon <= 360; lon += 6) {
      const { x, y } = latLonToXY(SOUTH_EDGE_LAT, lon);
      points.push(`${x},${y}`);
    }
    return `M ${points.join(" L ")} Z`;
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden bg-lunar-surface border border-white/10">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}
        className="cursor-crosshair block"
        onClick={handleMapClick}
      >
        <defs>
          <radialGradient id="poleGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3d3d3d" />
            <stop offset="100%" stopColor="#1a1a1c" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={MAP_SIZE} height={MAP_SIZE} fill="url(#poleGrad)" />
        <path
          d={poleEdgePath}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
        {/* PSR circles */}
        {psrCircles.map(({ psr, x, y, r }) => (
          <circle
            key={psr.id}
            cx={x}
            cy={y}
            r={r}
            fill={psr.icePriority ? COLOR_HIGH_ICE_RGBA : COLOR_PSR_RGBA}
            stroke={psr.icePriority ? COLOR_HIGH_ICE : COLOR_PSR}
            strokeWidth={1}
            onMouseEnter={() => setHoverPsr(psr)}
            onMouseLeave={() => setHoverPsr(null)}
            className="pointer-events-auto cursor-pointer"
          />
        ))}
        {/* Artemis III region markers */}
        {showArtemis && artemisPoints.map((a, i) => (
          <g key={i}>
            <circle
              cx={a.x}
              cy={a.y}
              r={5}
              fill="none"
              stroke="#fcd34d"
              strokeWidth={1.5}
              strokeDasharray="3 2"
            />
          </g>
        ))}
        {/* Selected base site */}
        {selectedXY && (
          <g filter="url(#glow)">
            <circle
              cx={selectedXY.x}
              cy={selectedXY.y}
              r={8}
              fill="rgba(34,197,94,0.4)"
              stroke="#22c55e"
              strokeWidth={2}
            />
            <circle cx={selectedXY.x} cy={selectedXY.y} r={3} fill="#22c55e" />
          </g>
        )}
      </svg>
      <div className="absolute bottom-2 left-2 text-xs text-white/60">
        Click map to place base site · Amber = ice-priority PSRs · Violet = PSR · Yellow dashed = Artemis III
      </div>
      {hoverPsr && (
        <div className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {hoverPsr.name || hoverPsr.id} · {hoverPsr.areaKm2.toFixed(0)} km²
          {hoverPsr.icePriority ? " · Ice priority" : ""}
        </div>
      )}
    </div>
  );
}
