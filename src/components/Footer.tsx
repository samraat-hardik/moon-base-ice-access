"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-lunar-surface/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 text-sm">
          <section>
            <h3 className="font-semibold text-white mb-3">Credits & data</h3>
            <ul className="text-white/70 space-y-1.5">
              <li>LROC PSR Atlas (Lunar Reconnaissance Orbiter)</li>
              <li>NASA SVS 3D Moon model (LRO)</li>
              <li>NASA Artemis III candidate regions & ice-priority PSRs</li>
            </ul>
          </section>
          <section>
            <h3 className="font-semibold text-white mb-3">App</h3>
            <ul className="text-white/70 space-y-1.5">
              <li><Link href="/" className="hover:text-white transition-colors">Explorer</Link></li>
              <li><Link href="/globe" className="hover:text-white transition-colors">3D Globe</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Compare</Link></li>
              <li><Link href="/regions" className="hover:text-white transition-colors">Regions</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            </ul>
          </section>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/50 space-y-1">
          <p>Imagery: NASA (public domain) and Unsplash (free to use).</p>
          <p>Moon PSR Explorer — for ISRU and lunar base planning. Not affiliated with NASA or SpaceX.</p>
        </div>
      </div>
    </footer>
  );
}
