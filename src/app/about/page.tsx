"use client";

import { SpaceImage } from "@/components/SpaceImage";
import { SPACE_IMAGES } from "@/lib/space-images";

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Hero with lunar image */}
      <section
        className="relative overflow-hidden rounded-b-2xl mx-4 mt-4 mb-8 min-h-[240px] bg-lunar-surface"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.7) 100%), url(${SPACE_IMAGES.lunarSurface})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
          <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4 animate-float backdrop-blur-sm">
            <span className="text-4xl" aria-hidden>🌙</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 animate-fade-in-up opacity-0-init drop-shadow-lg">
            About this app
          </h1>
          <p className="text-white/90 text-sm max-w-xl animate-fade-in-up opacity-0-init stagger-1 drop-shadow-md">
            Water Ice & PSR Explorer supports planning for a sustained lunar base—especially in line with
            SpaceX Starship and NASA Artemis.
          </p>
        </div>
        <p className="absolute bottom-2 right-4 z-10 text-xs text-white/60 drop-shadow">Unsplash (free to use)</p>
      </section>

      <div className="max-w-3xl mx-auto px-4 md:px-6 pb-12 space-y-10">
        <section className="animate-fade-in opacity-0-init stagger-2">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-lunar-ice" />
            Mission context
          </h2>
          <div className="rounded-xl border border-white/10 bg-lunar-surface/50 p-5 text-white/80 text-sm leading-relaxed space-y-3 mb-4">
            <p>
              The lunar South Pole is the target for Artemis and commercial landers. Permanently shadowed
              regions (PSRs) there are cold enough to trap water ice, which can be used for propellant
              (refueling Starship) and life support. Picking a base location involves balancing landing
              safety, solar power access, and proximity to ice-rich PSRs for in-situ resource utilization (ISRU).
            </p>
            <p>
              This tool helps you explore South Pole PSRs and score candidate base sites by ice access.
            </p>
          </div>
        </section>

        <section className="animate-fade-in opacity-0-init stagger-3">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-lunar-highlight" />
            Data sources
          </h2>
          <div className="mb-4">
            <SpaceImage
              src={SPACE_IMAGES.lroMoon}
              alt="Earth from space"
              credit="Unsplash (free to use)"
              variant="card"
              className="max-w-md"
            />
          </div>
          <ul className="space-y-3">
            {[
              {
                title: "LROC PSR Atlas",
                desc: "Lunar Reconnaissance Orbiter Camera Permanently Shadowed Regions Atlas. We fetch the South Pole PSR list from lroc.asu.edu when possible (live data) and fall back to a cached list otherwise.",
                href: "https://www.lroc.asu.edu/atlases/psr/list",
              },
              {
                title: "NASA high-priority ice regions",
                desc: "Ice-priority craters (e.g. Shackleton, Cabeus, Haworth, Faustini, Nobile) from NASA literature and Artemis planning.",
              },
              {
                title: "Artemis III candidate regions",
                desc: "NASA's candidate landing regions for Artemis III (e.g. Nobile Rim 1/2, Malapert Massif, Haworth) for reference.",
              },
            ].map((item, i) => (
              <li
                key={i}
                className="rounded-xl border border-white/10 bg-lunar-surface/50 p-4 hover:border-white/20 transition-colors"
              >
                <strong className="text-white">{item.title}</strong>
                <p className="text-white/70 text-sm mt-1">
                  {item.desc}
                  {item.href && (
                    <>
                      {" "}
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lunar-ice hover:underline"
                      >
                        View source
                      </a>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="animate-fade-in opacity-0-init stagger-4">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-lunar-ice" />
            Glossary
          </h2>
          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              ["PSR", "Permanently shadowed region — an area near the lunar poles that never receives direct sunlight and can retain water ice and other volatiles."],
              ["ISRU", "In-situ resource utilization — using local resources (e.g. lunar water ice for propellant and life support) instead of bringing everything from Earth."],
              ["Artemis", "NASA's program to return humans to the Moon, with the South Pole as the target. SpaceX Starship is the Human Landing System (HLS) for Artemis III and beyond."],
              ["Ice access score", "A 0–100 score we compute from distance to the nearest PSR and PSR area within 30 km. Higher means better potential for ISRU from nearby ice."],
            ].map(([term, def]) => (
              <div key={term} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <dt className="font-medium text-white text-sm">{term}</dt>
                <dd className="text-white/70 text-xs mt-1 leading-relaxed">{def}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="animate-fade-in opacity-0-init stagger-5">
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-5 rounded-full bg-lunar-highlight" />
            Pages
          </h2>
          <ul className="text-sm text-white/80 space-y-2">
            <li><strong className="text-white">Explorer</strong> — Map, click to place a base site, view ice access stats and quick-pick presets.</li>
            <li><strong className="text-white">3D Globe</strong> — Interactive NASA LRO moon model with amber/violet PSR markers; full-screen and South Pole views.</li>
            <li><strong className="text-white">Compare</strong> — Compare two candidate sites (e.g. Artemis regions) side by side.</li>
            <li><strong className="text-white">Regions</strong> — Sortable, searchable table of South Pole PSRs and Artemis III regions.</li>
            <li><strong className="text-white">About</strong> — This page.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
