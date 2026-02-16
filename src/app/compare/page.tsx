"use client";

import { useState, useEffect, useMemo } from "react";
import { SpaceImage } from "@/components/SpaceImage";
import { SPACE_IMAGES } from "@/lib/space-images";
import type { PSRRecord } from "@/data/psr-south-pole";
import { PSR_SOUTH_POLE, ARTEMIS_III_REGIONS } from "@/data/psr-south-pole";
import { computeIceAccess } from "@/lib/ice-access";
import type { IceAccessResult } from "@/lib/ice-access";

interface SiteOption {
  label: string;
  lat: number;
  lon: number;
}

const PRESETS: SiteOption[] = [
  ...ARTEMIS_III_REGIONS.map((r) => ({ label: r.name, lat: r.lat, lon: r.lon })),
  { label: "Near Shackleton", lat: -89.5, lon: 0 },
  { label: "Cabeus rim", lat: -84.5, lon: 324 },
  { label: "Faustini rim", lat: -86.8, lon: 77 },
];

function SiteCard({
  title,
  lat,
  lon,
  result,
  isWinner,
  metric,
}: {
  title: string;
  lat: number;
  lon: number;
  result: IceAccessResult;
  isWinner?: boolean;
  metric: "iceAccessScore" | "distanceToNearestPsrKm" | "psrCountWithinRadius";
}) {
  const value =
    metric === "distanceToNearestPsrKm"
      ? result.distanceToNearestPsrKm
      : metric === "psrCountWithinRadius"
        ? result.psrCountWithinRadius
        : result.iceAccessScore;
  const betterIsHigher = metric === "iceAccessScore" || metric === "psrCountWithinRadius";
  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-2 transition-all duration-200 hover:border-white/20 ${
        isWinner ? "border-lunar-ice bg-lunar-ice/10" : "border-white/10 bg-lunar-surface"
      }`}
    >
      <div className="font-semibold text-white flex items-center gap-2">
        {title}
        {isWinner && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-lunar-ice/30 text-lunar-ice">Better</span>
        )}
      </div>
      <p className="text-white/60 text-sm font-mono">
        {lat.toFixed(2)}°S, {lon.toFixed(1)}°E
      </p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
        <dt className="text-white/50">Ice score</dt>
        <dd className="text-white font-mono">{result.iceAccessScore}/100</dd>
        <dt className="text-white/50">Nearest PSR</dt>
        <dd className="text-white font-mono">{result.distanceToNearestPsrKm} km</dd>
        <dt className="text-white/50">PSRs in 30 km</dt>
        <dd className="text-white font-mono">{result.psrCountWithinRadius}</dd>
        {result.nearestPsr && (
          <>
            <dt className="text-white/50">Nearest name</dt>
            <dd className="text-lunar-ice text-xs truncate">{result.nearestPsr.name || result.nearestPsr.id}</dd>
          </>
        )}
      </dl>
    </div>
  );
}

export default function ComparePage() {
  const [psrs, setPsrs] = useState<PSRRecord[]>(PSR_SOUTH_POLE);
  const [siteA, setSiteA] = useState<SiteOption>(PRESETS[0]);
  const [siteB, setSiteB] = useState<SiteOption>(PRESETS[4]);

  useEffect(() => {
    fetch("/api/psr")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.psrs?.length) setPsrs(data.psrs);
      })
      .catch(() => {});
  }, []);

  const resultA = useMemo(
    () => computeIceAccess(siteA.lat, siteA.lon, 30, psrs),
    [siteA.lat, siteA.lon, psrs]
  );
  const resultB = useMemo(
    () => computeIceAccess(siteB.lat, siteB.lon, 30, psrs),
    [siteB.lat, siteB.lon, psrs]
  );

  const winnerScore = resultA.iceAccessScore >= resultB.iceAccessScore ? "A" : "B";
  const winnerDist = resultA.distanceToNearestPsrKm <= resultB.distanceToNearestPsrKm ? "A" : "B";

  return (
    <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 animate-fade-in mb-6">
        <SpaceImage
          src={SPACE_IMAGES.lunarSurface}
          alt="Moon in space"
          credit="Unsplash (free to use)"
          variant="inline"
          className="shrink-0"
        />
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Compare base sites</h1>
          <p className="text-white/60 text-sm">
            Select two candidate locations and compare ice access and PSR proximity.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-fade-in stagger-1">
        <div>
          <label className="block text-white/70 text-sm mb-2">Site A</label>
          <select
            value={PRESETS.findIndex((p) => p.label === siteA.label)}
            onChange={(e) => setSiteA(PRESETS[Number(e.target.value)])}
            className="w-full rounded-lg bg-white/10 border border-white/20 text-white px-3 py-2 text-sm focus:ring-2 focus:ring-lunar-ice"
          >
            {PRESETS.map((p, i) => (
              <option key={p.label} value={i} className="bg-lunar-surface text-white">
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white/70 text-sm mb-2">Site B</label>
          <select
            value={PRESETS.findIndex((p) => p.label === siteB.label)}
            onChange={(e) => setSiteB(PRESETS[Number(e.target.value)])}
            className="w-full rounded-lg bg-white/10 border border-white/20 text-white px-3 py-2 text-sm focus:ring-2 focus:ring-lunar-ice"
          >
            {PRESETS.map((p, i) => (
              <option key={p.label} value={i} className="bg-lunar-surface text-white">
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in stagger-2">
        <SiteCard
          title={siteA.label}
          lat={siteA.lat}
          lon={siteA.lon}
          result={resultA}
          isWinner={winnerScore === "A"}
          metric="iceAccessScore"
        />
        <SiteCard
          title={siteB.label}
          lat={siteB.lat}
          lon={siteB.lon}
          result={resultB}
          isWinner={winnerScore === "B"}
          metric="iceAccessScore"
        />
      </div>
      <div className="mt-6 rounded-xl border border-white/10 bg-lunar-surface/50 p-4">
        <h2 className="text-sm font-semibold text-white/90 mb-2">Summary</h2>
        <ul className="text-sm text-white/80 space-y-1">
          <li>
            <strong className="text-white">Better ice access score:</strong>{" "}
            {winnerScore === "A" ? siteA.label : siteB.label} (
            {winnerScore === "A" ? resultA.iceAccessScore : resultB.iceAccessScore}/100)
          </li>
          <li>
            <strong className="text-white">Closer to a PSR:</strong>{" "}
            {winnerDist === "A" ? siteA.label : siteB.label} (
            {winnerDist === "A" ? resultA.distanceToNearestPsrKm : resultB.distanceToNearestPsrKm} km)
          </li>
        </ul>
      </div>
    </main>
  );
}
