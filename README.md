# Moon PSR Explorer

Explore lunar South Pole **Permanently Shadowed Regions (PSRs)** and **ice access** for base siting and in-situ resource utilization (ISRU) planning.

## Features

- **Explorer** — Interactive 2D South Pole map; click to place a base site and see ice access score, nearest PSR, and PSR count within 30 km
- **3D Globe** — Interactive NASA LRO Moon model with PSR and ice-priority markers (amber/violet)
- **Compare** — Compare two candidate sites side by side (ice score, distance to PSR, etc.)
- **Regions** — Sortable, searchable table of South Pole PSRs
- **About** — Mission context, data sources, glossary

## Tech stack

- **Next.js 14** (App Router), **React 18**, **TypeScript**, **Tailwind CSS**
- **Three.js** / **React Three Fiber** for the 3D globe
- PSR data from LROC PSR Atlas (live API or cached)

## Getting started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm run start
```

### Environment (optional)

- `NEXT_PUBLIC_APP_URL` — Full public URL (e.g. `https://your-app.vercel.app`) for canonical URLs, sitemap, and Open Graph. On Vercel, `VERCEL_URL` is used if this is not set.

## Data and credits

- PSR list: LROC PSR Atlas (Lunar Reconnaissance Orbiter)
- 3D Moon model: NASA SVS (LRO)
- Imagery: Unsplash (free to use)

This app is for educational and planning purposes. Not affiliated with NASA or SpaceX.

## License

MIT
