"use client";

import { useState, useEffect, useMemo } from "react";
import { SpaceImage } from "@/components/SpaceImage";
import { SPACE_IMAGES } from "@/lib/space-images";
import type { PSRRecord } from "@/data/psr-south-pole";
import { PSR_SOUTH_POLE, ARTEMIS_III_REGIONS } from "@/data/psr-south-pole";

type SortKey = "lat" | "lon" | "areaKm2" | "id" | "icePriority";

export default function RegionsPage() {
  const [psrs, setPsrs] = useState<PSRRecord[]>(PSR_SOUTH_POLE);
  const [sortKey, setSortKey] = useState<SortKey>("areaKm2");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterIceOnly, setFilterIceOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/psr")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.psrs?.length) setPsrs(data.psrs);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let list = psrs;
    if (filterIceOnly) list = list.filter((p) => p.icePriority);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      if (sortKey === "icePriority") {
        const cmp = a.icePriority === b.icePriority ? 0 : a.icePriority ? -1 : 1;
        return sortDir === "desc" ? cmp : -cmp;
      }
      const aVal = a[sortKey] as number;
      const bVal = b[sortKey] as number;
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [psrs, sortKey, sortDir, filterIceOnly, search]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else setSortKey(key);
  };

  return (
    <main className="flex-1 p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 animate-fade-in mb-6">
        <SpaceImage
          src={SPACE_IMAGES.lroMoon}
          alt="Earth from space"
          credit="Unsplash (free to use)"
          variant="inline"
          className="shrink-0"
        />
        <div>
          <h1 className="text-xl font-bold text-white mb-1">South Pole regions</h1>
          <p className="text-white/60 text-sm">
            Permanently shadowed regions (PSRs) and Artemis III candidate landing regions.
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-white/10 bg-lunar-surface/50 p-4 mb-6 animate-fade-in stagger-1">
        <h2 className="text-sm font-semibold text-white/90 mb-3">Artemis III candidate regions</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {ARTEMIS_III_REGIONS.map((r) => (
            <li key={r.name} className="flex justify-between text-white/80">
              <span>{r.name}</span>
              <span className="font-mono text-white/60">{r.lat}°S, {r.lon}°E</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 mb-4 animate-fade-in stagger-2">
        <input
          type="search"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg bg-white/10 border border-white/20 text-white px-3 py-2 text-sm w-56 placeholder-white/40 focus:ring-2 focus:ring-lunar-ice"
        />
        <label className="flex items-center gap-2 cursor-pointer text-sm text-white/80">
          <input
            type="checkbox"
            checked={filterIceOnly}
            onChange={(e) => setFilterIceOnly(e.target.checked)}
            className="rounded border-white/30 bg-white/10 text-lunar-ice"
          />
          Ice-priority only
        </label>
      </div>

      <div className="rounded-xl border border-white/10 bg-lunar-surface overflow-hidden animate-fade-in stagger-3">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/70">
                <th className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => toggleSort("id")}
                    className="hover:text-white font-medium"
                  >
                    ID {sortKey === "id" && (sortDir === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => toggleSort("lat")}
                    className="hover:text-white font-medium"
                  >
                    Lat {sortKey === "lat" && (sortDir === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => toggleSort("lon")}
                    className="hover:text-white font-medium"
                  >
                    Lon {sortKey === "lon" && (sortDir === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => toggleSort("areaKm2")}
                    className="hover:text-white font-medium"
                  >
                    Area (km²) {sortKey === "areaKm2" && (sortDir === "asc" ? "↑" : "↓")}
                  </button>
                </th>
                <th className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => toggleSort("icePriority")}
                    className="hover:text-white font-medium"
                  >
                    Ice priority {sortKey === "icePriority" && (sortDir === "asc" ? "↑" : "↓")}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 hover:bg-white/5 text-white/90"
                >
                  <td className="px-3 py-2 font-mono text-xs">{p.id}</td>
                  <td className="px-3 py-2">{p.name || "—"}</td>
                  <td className="px-3 py-2 font-mono">{p.lat}</td>
                  <td className="px-3 py-2 font-mono">{p.lon}</td>
                  <td className="px-3 py-2 font-mono">{p.areaKm2.toFixed(1)}</td>
                  <td className="px-3 py-2">
                    {p.icePriority ? (
                      <span className="text-lunar-ice text-xs">Yes</span>
                    ) : (
                      <span className="text-white/40">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-3 py-2 text-xs text-white/50 border-t border-white/10">
          Showing {filtered.length} of {psrs.length} South Pole PSRs
        </div>
      </div>
    </main>
  );
}
