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
      <div className="relative h-32 sm:h-40 overflow-hidden border-b border-white/10 animate-fade-in">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7) 0%, transparent 50%), url(${SPACE_IMAGES.earthMoon})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 flex items-center px-4 sm:px-6">
          <p className="text-white/95 text-sm sm:text-base max-w-xl drop-shadow-lg">
            Explore lunar South Pole PSRs and pick candidate base sites for ice access and ISRU.
          </p>
        </div>
        <p className="absolute bottom-2 right-4 text-xs text-white/50">NASA</p>
      </div>
      <div className="px-4 py-2 border-b border-white/10 flex items-center gap-4 flex-wrap animate-fade-in">
        <span className="text-white/60 text-sm">Data:</span>
        {dataSource === "live" && (
          <span className="text-lunar-ice text-sm font-medium">Live from LROC ({psrs.length} PSRs)</span>
        )}
        {dataSource === "cached" && (
          <span className="text-amber-400/90 text-sm">Cached</span>
        )}
        {dataSource === "loading" && (
          <span className="text-white/50 text-sm">Loading…</span>
        )}
      </div>
      <div className="flex-1 flex gap-4 p-4 overflow-hidden min-h-0">
        <div className="animate-fade-in stagger-1">
          <IceAccessSidebar
          lat={selectedLat}
          lon={selectedLon}
          result={iceResult}
          dataSource={dataSource}
          psrCount={psrs.length}
        />
        </div>
        <div className="flex-1 min-w-0 flex flex-col items-center gap-3 animate-fade-in stagger-2">
          <div className="w-full max-w-[520px] flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white">
                <input
                  type="checkbox"
                  checked={showIceOnly}
                  onChange={(e) => setShowIceOnly(e.target.checked)}
                  className="rounded border-white/30 bg-white/10 text-lunar-ice focus:ring-lunar-ice"
                />
                Ice-priority PSRs only
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white">
                <input
                  type="checkbox"
                  checked={showArtemis}
                  onChange={(e) => setShowArtemis(e.target.checked)}
                  className="rounded border-white/30 bg-white/10 text-lunar-highlight focus:ring-lunar-highlight"
                />
                Artemis III regions
              </label>
            </div>
            <div className="aspect-square w-full max-w-[520px]">
              <SouthPoleMap
                psrs={psrs}
                onSelectSite={handleSelectSite}
                selectedLat={selectedLat}
                selectedLon={selectedLon}
                showIceOnly={showIceOnly}
                showArtemis={showArtemis}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-white/50 text-xs self-center">Quick pick:</span>
              {QUICK_PICKS.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => handleQuickPick(q.lat, q.lon)}
                  className="px-2 py-1 rounded bg-white/10 text-white/90 text-xs hover:bg-white/20 hover:text-white transition-all duration-200 hover:scale-105"
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
