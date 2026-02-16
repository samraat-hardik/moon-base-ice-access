"use client";

import { useState, useCallback, useEffect } from "react";
import { SouthPoleMap } from "@/components/SouthPoleMap";
import { IceAccessSidebar } from "@/components/IceAccessSidebar";
import { SpaceImage } from "@/components/SpaceImage";
import { SPACE_IMAGES } from "@/lib/space-images";
import type { IceAccessResult } from "@/lib/ice-access";
import type { PSRRecord } from "@/data/psr-south-pole";
import { PSR_SOUTH_POLE } from "@/data/psr-south-pole";
import { computeIceAccess } from "@/lib/ice-access";
import { ARTEMIS_III_REGIONS } from "@/data/psr-south-pole";

const QUICK_PICKS = [
  { label: "Near Shackleton", lat: -89.5, lon: 0 },
  { label: "Nobile Rim 1", lat: -85.2, lon: 306 },
  { label: "Haworth", lat: -87.5, lon: 355 },
  { label: "Cabeus rim", lat: -84.5, lon: 324 },
  { label: "Malapert", lat: -85.5, lon: 0 },
];

export default function Home() {
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLon, setSelectedLon] = useState<number | null>(null);
  const [iceResult, setIceResult] = useState<IceAccessResult | null>(null);
  const [psrs, setPsrs] = useState<PSRRecord[]>(PSR_SOUTH_POLE);
  const [dataSource, setDataSource] = useState<"live" | "cached" | "loading">("loading");
  const [showIceOnly, setShowIceOnly] = useState(false);
  const [showArtemis, setShowArtemis] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/psr");
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data.psrs && Array.isArray(data.psrs) && data.psrs.length > 0) {
            setPsrs(data.psrs);
            setDataSource("live");
            return;
          }
        }
        setDataSource("cached");
      } catch {
        if (!cancelled) setDataSource("cached");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelectSite = useCallback(
    (lat: number, lon: number, result: IceAccessResult) => {
      setSelectedLat(lat);
      setSelectedLon(lon);
      setIceResult(result);
    },
    []
  );

  const handleQuickPick = useCallback(
    (lat: number, lon: number) => {
      const result = computeIceAccess(lat, lon, 30, psrs);
      handleSelectSite(lat, lon, result);
    },
    [psrs, handleSelectSite]
  );

  return (
    <main className="flex-1 flex flex-col min-h-0">
      {/* Hero strip */}
      <div className="relative h-36 sm:h-44 overflow-hidden border-b border-white/10 animate-fade-in">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(26,26,28,0.92) 0%, rgba(26,26,28,0.6) 50%, transparent 100%), url(${SPACE_IMAGES.earthMoon})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8">
          <span className="inline-flex items-center gap-1.5 text-lunar-ice/90 text-xs font-medium uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-lunar-ice animate-pulse" />
            South Pole · PSR & Ice Access
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg max-w-2xl">
            Pick a base site on the map
          </h1>
          <p className="text-white/85 text-sm sm:text-base max-w-xl mt-1 drop-shadow-md">
            Click anywhere to see ice access score, distance to PSRs, and ISRU potential.
          </p>
        </div>
      </div>
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3 flex-wrap animate-fade-in bg-lunar-surface/30">
        <span className="text-white/50 text-xs uppercase tracking-wider">Data source</span>
        {dataSource === "live" && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lunar-ice/15 text-lunar-ice text-sm font-medium border border-lunar-ice/30">
            Live · {psrs.length} PSRs
          </span>
        )}
        {dataSource === "cached" && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400/90 text-sm border border-amber-500/30">
            Cached
          </span>
        )}
        {dataSource === "loading" && (
          <span className="inline-flex items-center gap-1.5 text-white/50 text-sm">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
            Loading…
          </span>
        )}
      </div>
      <div className="flex-1 flex gap-5 p-4 sm:p-6 overflow-hidden min-h-0">
        <div className="animate-fade-in stagger-1 shrink-0">
          <IceAccessSidebar
            lat={selectedLat}
            lon={selectedLon}
            result={iceResult}
            dataSource={dataSource}
            psrCount={psrs.length}
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col items-center gap-4 animate-fade-in stagger-2">
          <div className="w-full max-w-[520px] flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm p-3 rounded-xl bg-lunar-surface/50 border border-white/10">
              <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={showIceOnly}
                  onChange={(e) => setShowIceOnly(e.target.checked)}
                  className="rounded border-white/30 bg-white/10 text-lunar-ice focus:ring-2 focus:ring-lunar-ice/50"
                />
                Ice-priority PSRs only
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white transition-colors">
                <input
                  type="checkbox"
                  checked={showArtemis}
                  onChange={(e) => setShowArtemis(e.target.checked)}
                  className="rounded border-white/30 bg-white/10 text-lunar-highlight focus:ring-2 focus:ring-lunar-highlight/50"
                />
                Artemis III regions
              </label>
            </div>
            <div className="aspect-square w-full max-w-[520px] rounded-xl overflow-hidden border border-white/10 shadow-xl shadow-black/20 hover:border-white/20 transition-colors">
              <SouthPoleMap
                psrs={psrs}
                onSelectSite={handleSelectSite}
                selectedLat={selectedLat}
                selectedLon={selectedLon}
                showIceOnly={showIceOnly}
                showArtemis={showArtemis}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white/50 text-xs uppercase tracking-wider">Quick pick</span>
              {QUICK_PICKS.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => handleQuickPick(q.lat, q.lon)}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white/90 text-xs font-medium hover:bg-lunar-ice/20 hover:text-lunar-ice border border-white/10 hover:border-lunar-ice/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
