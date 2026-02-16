"use client";

import type { IceAccessResult } from "@/lib/ice-access";

interface IceAccessSidebarProps {
  lat: number | null;
  lon: number | null;
  result: IceAccessResult | null;
  dataSource?: "live" | "cached" | "loading";
  psrCount?: number;
}

export function IceAccessSidebar({ lat, lon, result, dataSource, psrCount }: IceAccessSidebarProps) {
  if (lat == null || lon == null || result == null) {
    return (
      <aside className="w-80 shrink-0 rounded-xl bg-lunar-surface border border-white/10 p-4 flex flex-col gap-4">
        <h2 className="text-lunar-highlight font-semibold text-sm uppercase tracking-wider">
          Ice & PSR Explorer
        </h2>
        <p className="text-white/70 text-sm">
          Click anywhere on the South Pole map to place a candidate base site.
          We’ll show distance to water-ice PSRs and an <strong>ice access score</strong> for
          ISRU (Starship propellant & life support).
        </p>
        <div className="mt-auto text-xs text-white/50">
          {dataSource === "live" && psrCount != null && (
            <span className="text-lunar-ice">Live: {psrCount} South Pole PSRs from LROC</span>
          )}
          {dataSource === "cached" && "Data: Cached LROC PSR Atlas · NASA ice regions"}
          {(!dataSource || dataSource === "loading") && "Data: LROC PSR Atlas, NASA ice regions"}
          {" · Aligned with SpaceX lunar base planning"}
        </div>
      </aside>
    );
  }

  const scoreColor =
    result.iceAccessScore >= 70
      ? "text-emerald-400"
      : result.iceAccessScore >= 40
        ? "text-amber-400"
        : "text-rose-400";

  return (
    <aside className="w-80 shrink-0 rounded-xl bg-lunar-surface border border-white/10 p-4 flex flex-col gap-4">
      <h2 className="text-lunar-highlight font-semibold text-sm uppercase tracking-wider">
        Base site analysis
      </h2>
      <div>
        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Location</p>
        <p className="text-white font-mono text-sm">
          {lat.toFixed(2)}°S, {lon.toFixed(1)}°E
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div className="rounded-lg bg-black/30 p-3">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Ice access score</p>
          <p className={`text-2xl font-bold ${scoreColor}`}>{result.iceAccessScore}/100</p>
          <p className="text-white/60 text-xs mt-1">
            Higher = better for refueling Starship and life support from lunar ice
          </p>
        </div>
        <div className="rounded-lg bg-black/30 p-3">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Distance to nearest PSR</p>
          <p className="text-white font-semibold">{result.distanceToNearestPsrKm} km</p>
          {result.nearestPsr && (
            <p className="text-lunar-ice text-xs mt-1">
              → {result.nearestPsr.name || result.nearestPsr.id}
              {result.nearestPsr.icePriority ? " (ice priority)" : ""}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-black/30 p-3">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-1">PSRs within 30 km</p>
          <p className="text-white font-semibold">{result.psrCountWithinRadius} regions</p>
          <p className="text-white/60 text-xs mt-1">
            Total shadow area: {result.psrAreaWithinRadiusKm2.toFixed(0)} km²
          </p>
        </div>
        {result.nearbyIcePriorityPsrs.length > 0 && (
          <div className="rounded-lg bg-black/30 p-3">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Ice-priority PSRs within 50 km</p>
            <ul className="text-lunar-ice text-sm space-y-0.5">
              {result.nearbyIcePriorityPsrs.map((psr) => (
                <li key={psr.id}>{psr.name || psr.id}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-auto text-xs text-white/50 border-t border-white/10 pt-3">
        Ideal base sites: short distance to ice-rich PSRs for ISRU; SpaceX Starship can refuel and support sustained presence.
      </div>
    </aside>
  );
}
