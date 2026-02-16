import { NextResponse } from "next/server";

const LROC_PSR_LIST_URLS = [
  "https://www.lroc.asu.edu/atlases/psr/list",
  "https://lroc.im-ldi.com/atlases/psr/list",
];

/** Known ice-priority South Pole PSR names (from NASA literature) - we mark these when ID/name matches */
const ICE_PRIORITY_NAMES = new Set([
  "shackleton", "haworth", "faustini", "shoemaker", "cabeus", "nobile",
  "sverdrup", "hermite", "malapert", "whipple", "cab", "cabeus a", "cabeus b",
]);

export interface PSRRecordApi {
  id: string;
  lat: number;
  lon: number;
  areaKm2: number;
  name?: string;
  icePriority: boolean;
}

function parsePsrList(html: string): PSRRecordApi[] {
  const psrs: PSRRecordApi[] = [];
  const rowRegex = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
  const rows = html.match(rowRegex) || [];
  for (const row of rows) {
    if (!row.includes("SP_")) continue;
    const idMatch = row.match(/(SP_[a-zA-Z0-9_]+)/);
    const id = idMatch ? idMatch[1] : "";
    if (!id) continue;
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    const cells: string[] = [];
    let m;
    while ((m = cellRegex.exec(row)) !== null) cells.push(m[1].replace(/<[^>]+>/g, "").trim());
    if (cells.length < 4) continue;
    const lat = parseFloat(cells[1]);
    const lon = parseFloat(cells[2]);
    const area = parseFloat(cells[3]);
    if (Number.isNaN(lat) || lat > 0 || lat < -90) continue;
    const name = (cells[6] || "").trim() || undefined;
    const nameLower = (name || id).toLowerCase();
    const icePriority = Array.from(ICE_PRIORITY_NAMES).some((n) => nameLower.includes(n) || id.toLowerCase().includes(n));
    psrs.push({
      id,
      lat,
      lon: Number.isNaN(lon) ? 0 : lon < 0 ? lon + 360 : lon,
      areaKm2: Number.isNaN(area) ? 0 : area,
      name: name || undefined,
      icePriority,
    });
  }
  return psrs;
}

/** Fallback: parse markdown-style table (if server gets markdown) */
function parsePsrListFromMarkdown(text: string): PSRRecordApi[] {
  const psrs: PSRRecordApi[] = [];
  const lines = text.split(/\n/);
  for (const line of lines) {
    if (!line.includes("| SP_") && !line.includes("| -8") && !line.includes("| -9")) continue;
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 5) continue;
    const firstCell = cells[1] || "";
    const idMatch = firstCell.match(/SP_[^\s\]\)]+/);
    const id = idMatch ? idMatch[0] : "";
    if (!id) continue;
    const lat = parseFloat(cells[2]);
    const lon = parseFloat(cells[3]);
    const area = parseFloat(cells[4]);
    if (Number.isNaN(lat) || lat > 0 || lat < -90) continue;
    const name = (cells[7] || cells[6] || "").trim() || undefined;
    const nameLower = (name || id).toLowerCase();
    const icePriority = Array.from(ICE_PRIORITY_NAMES).some((n) => nameLower.includes(n) || id.toLowerCase().includes(n));
    psrs.push({
      id,
      lat,
      lon: Number.isNaN(lon) ? 0 : lon < 0 ? lon + 360 : lon,
      areaKm2: Number.isNaN(area) ? 0 : area,
      name: name || undefined,
      icePriority,
    });
  }
  return psrs;
}

export async function GET() {
  for (const url of LROC_PSR_LIST_URLS) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "MoonPSRExplorer/1.0 (ISRU planning)" },
        next: { revalidate: 86400 },
      });
      if (!res.ok) continue;
      const text = await res.text();
      let psrs = parsePsrList(text);
      if (psrs.length === 0) psrs = parsePsrListFromMarkdown(text);
      if (psrs.length > 0) {
        return NextResponse.json({
          psrs,
          source: "LROC",
          fetchedAt: new Date().toISOString(),
          count: psrs.length,
        });
      }
    } catch {
      continue;
    }
  }
  return NextResponse.json(
    { error: "Failed to fetch live PSR data from LROC" },
    { status: 502 }
  );
}
