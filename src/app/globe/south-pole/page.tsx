"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import type { PSRRecord } from "@/data/psr-south-pole";
import { PSR_SOUTH_POLE } from "@/data/psr-south-pole";
import { COLOR_HIGH_ICE, COLOR_PSR } from "@/lib/globe-colors";

const MoonGlobeScene = dynamic(
  () => import("@/components/MoonGlobeScene").then((m) => ({ default: m.MoonGlobeScene })),
  { ssr: false, loading: () => <GlobeLoading /> }
);

function GlobeLoading() {
  return (
    <div className="w-full min-h-[70vh] rounded-xl bg-lunar-surface border border-white/10 flex items-center justify-center animate-fade-in">
      <div className="text-white/60 text-sm flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLOR_HIGH_ICE }} />
        Loading South Pole view…
      </div>
    </div>
  );
}

function SouthPoleContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isFullScreen = searchParams.get("fullscreen") === "1";
  const [psrs, setPsrs] = useState<PSRRecord[]>(PSR_SOUTH_POLE);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/psr");
        if (cancelled || !res.ok) return;
        const data = await res.json();
        if (data.psrs?.length) setPsrs(data.psrs);
      } catch {
        // keep static
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {isFullScreen && (
        <MoonGlobeScene defaultView="south-pole" psrs={psrs} fullScreen />
      )}
      <main
        className={
          isFullScreen
            ? "fixed inset-0 z-50 pointer-events-none flex flex-col items-start justify-between p-4"
            : "flex-1 flex flex-col p-4"
        }
      >
        <div
          className={
            isFullScreen
              ? "flex items-center justify-between w-full pointer-events-auto"
              : "max-w-4xl w-full mx-auto flex flex-col gap-4"
          }
        >
          {!isFullScreen && (
            <div>
              <h1 className="text-xl font-semibold text-white mb-1">3D Moon: South Pole</h1>
              <p className="text-white/70 text-sm">
                Lunar south pole region (Artemis III candidate area). Same NASA LRO 3D model, oriented for PSR and ice
                exploration.{" "}
                <Link href="/globe/south-pole?fullscreen=1" className="text-lunar-ice hover:underline">
                  Full screen
                </Link>
                {" · "}
                <Link href="/globe" className="text-lunar-ice hover:underline">Full globe</Link>
                {" · "}
                <Link href="/" className="text-lunar-highlight hover:underline">PSR Explorer</Link>
              </p>
            </div>
          )}

          {!isFullScreen && <MoonGlobeScene defaultView="south-pole" psrs={psrs} />}

          {isFullScreen && (
            <>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/globe/south-pole")}
                  className="px-3 py-2 rounded-lg bg-white/15 text-white text-sm font-medium hover:bg-white/25"
                >
                  Exit full screen
                </button>
              </div>
              <div className="rounded-lg bg-lunar-surface/95 border border-white/10 px-4 py-2 text-xs text-white/80 pointer-events-auto">
                <span className="font-medium" style={{ color: COLOR_HIGH_ICE }}>● Amber</span> = High ice priority (Artemis/ISRU)
                {" · "}
                <span className="font-medium" style={{ color: COLOR_PSR }}>● Violet</span> = PSR (ice potential)
              </div>
            </>
          )}
        </div>

        {!isFullScreen && (
          <div className="max-w-4xl w-full mx-auto text-xs text-white/50 border-t border-white/10 pt-3 mt-2">
            Model: Moon_NASA_LRO_8k_Flat.glb (NASA SVS 14959). Credit: NASA Goddard, LRO.
          </div>
        )}
      </main>
    </>
  );
}

export default function SouthPoleGlobePage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center text-white/60">Loading…</div>}>
      <SouthPoleContent />
    </Suspense>
  );
}
