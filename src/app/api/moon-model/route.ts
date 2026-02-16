import { NextResponse } from "next/server";

const NASA_MOON_GLB =
  "https://svs.gsfc.nasa.gov/vis/a010000/a014900/a014959/Moon_NASA_LRO_8k_Flat.glb";

/** Proxy NASA 3D Moon GLB to avoid CORS when loading from localhost. */
export async function GET() {
  try {
    const res = await fetch(NASA_MOON_GLB, {
      headers: { "User-Agent": "MoonPSRExplorer/1.0 (Lunar 3D)" },
      next: { revalidate: 86400 * 7 }, // cache 7 days
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `NASA returned ${res.status}` },
        { status: res.status }
      );
    }
    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "model/gltf-binary",
        "Cache-Control": "public, max-age=604800, s-maxage=604800",
      },
    });
  } catch (e) {
    console.error("moon-model proxy error:", e);
    return NextResponse.json(
      { error: "Failed to fetch NASA moon model" },
      { status: 502 }
    );
  }
}
