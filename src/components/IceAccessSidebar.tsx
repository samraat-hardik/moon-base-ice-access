"use client";

import type { IceAccessResult } from "@/lib/ice-access";

interface IceAccessSidebarProps {
  lat: number | null;
  lon: number | null;
  result: IceAccessResult | null;
  dataSource?: "live" | "cached" | "loading";
  psrCount?: number;
}

function ScoreRing({ score }: { score: number }) {
  const scoreColor =
    score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#f87171";
  return (
    <div
      className="score-ring"
      style={
        {
          "--score": score,
          "--score-color": scoreColor,
          "--ring-size": "80px",
          "--ring-thickness": "6px",
        } as React.CSSProperties
      }
    >
      <div className="score-ring-inner text-white">{score}</div>
    </div>
  );
}

export function IceAccessSidebar({ lat, lon, result, dataSource, psrCount }: IceAccessSidebarProps) {
  if (lat == null || lon == null || result == null) {
    return (
      <aside className="w-80 shrink-0 rounded-2xl bg-lunar-surface/80 border border-white/10 p-5 flex flex-col gap-5 shadow-xl shadow-black/20 backdrop-blur-sm animate-fade-in">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-lunar-ice" />
          <h2 className="text-lunar-ice font-semibold text-sm uppercase tracking-wider">
            Site predictor
          </h2>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-4">
          <p className="text-white/80 text-sm leading-relaxed">
            Click anywhere on the South Pole map to place a candidate base site.
          </p>
          <p className="text-white/60 text-sm">
            We’ll show an <strong className="text-white/80">ice access score</strong> (0–100),
            distance to water-ice PSRs, and ISRU potential for propellant and life support.
          </p>
          <div className="mt-2 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60">
            Tip: use <span className="text-lunar-ice font-medium">Quick pick</span> below the map for preset locations.
          </div>
        </div>
        <div className="pt-3 border-t border-white/10 text-xs text-white/50 space-y-0.5">
          {dataSource === "live" && psrCount != null && (
            <p className="text-lunar-ice/80">Live: {psrCount} South Pole PSRs from LROC</p>
          )}
          {(dataSource === "cached" || !dataSource || dataSource === "loading") && (
            <p>LROC PSR Atlas · NASA ice regions</p>
          )}
        </div>
      </aside>
    );
  }

  const scoreLabel =
    result.iceAccessScore >= 70
      ? "Strong"
      : result.iceAccessScore >= 40
        ? "Moderate"
        : "Low";
  const scoreLabelColor =
    result.iceAccessScore >= 70
      ? "text-emerald-400"
      : result.iceAccessScore >= 40
        ? "text-amber-400"
        : "text-rose-400";

  return (
    <aside className="w-80 shrink-0 rounded-2xl bg-lunar-surface/80 border border-white/10 p-5 flex flex-col gap-5 shadow-xl shadow-black/20 backdrop-blur-sm animate-scale-in hover-lift">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
          Base site analysis
        </h2>
      </div>

      {/* Location */}
      <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Location</p>
        <p className="text-white font-mono text-sm font-medium">
          {lat.toFixed(2)}°S, {lon.toFixed(1)}°E
        </p>
      </div>

      {/* Ice access score with ring */}
      <div className="flex items-center gap-4 rounded-xl bg-black/20 border border-white/10 p-4">
        <ScoreRing score={result.iceAccessScore} />
        <div className="flex-1 min-w-0">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-0.5">Ice access score</p>
          <p className={`text-lg font-bold ${scoreLabelColor}`}>{scoreLabel}</p>
          <p className="text-white/60 text-xs mt-1">
            Higher = better for ISRU and refueling
          </p>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 gap-3">
        <div className="rounded-xl bg-black/20 border border-white/10 p-3 hover:border-white/15 transition-colors">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Nearest PSR</p>
          <p className="text-white font-semibold">{result.distanceToNearestPsrKm} km</p>
          {result.nearestPsr && (
            <p className="text-lunar-ice text-xs mt-1 truncate" title={result.nearestPsr.name || result.nearestPsr.id}>
              → {result.nearestPsr.name || result.nearestPsr.id}
              {result.nearestPsr.icePriority ? " · Ice priority" : ""}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-black/20 border border-white/10 p-3 hover:border-white/15 transition-colors">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">PSRs within 30 km</p>
          <p className="text-white font-semibold">{result.psrCountWithinRadius} regions</p>
          <p className="text-white/60 text-xs mt-1">
            {result.psrAreaWithinRadiusKm2.toFixed(0)} km² shadow area
          </p>
        </div>
        {result.nearbyIcePriorityPsrs.length > 0 && (
          <div className="rounded-xl bg-black/20 border border-white/10 p-3 hover:border-white/15 transition-colors">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Ice-priority within 50 km</p>
            <ul className="text-lunar-ice text-sm space-y-0.5">
              {result.nearbyIcePriorityPsrs.map((psr) => (
                <li key={psr.id} className="truncate">{psr.name || psr.id}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-white/10 text-xs text-white/50">
        Ideal sites: short distance to ice-rich PSRs for in-situ resource utilization.
      </div>
    </aside>
  );
}
