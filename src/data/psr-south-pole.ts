/**
 * South Pole Permanently Shadowed Regions (PSRs)
 * Data derived from LROC PSR Atlas (lroc.asu.edu/atlases/psr) and NASA high-priority ice regions.
 * Used for ISRU planning: water ice in PSRs supports Starship propellant and life support.
 */

export interface PSRRecord {
  id: string;
  lat: number;   // degrees, -90 to 0 (South Pole)
  lon: number;   // degrees, 0–360
  areaKm2: number;
  name?: string;
  /** High-priority ice-bearing PSR (literature/NASA); better for base siting */
  icePriority: boolean;
}

export const PSR_SOUTH_POLE: PSRRecord[] = [
  // High-priority ice-bearing craters (Artemis / ISRU targets)
  { id: "shackleton", lat: -89.9, lon: 0, areaKm2: 100, name: "Shackleton", icePriority: true },
  { id: "haworth", lat: -87.5, lon: 355, areaKm2: 85, name: "Haworth", icePriority: true },
  { id: "faustini", lat: -87.3, lon: 77, areaKm2: 120, name: "Faustini", icePriority: true },
  { id: "shoemaker", lat: -88.1, lon: 44.9, areaKm2: 95, name: "Shoemaker", icePriority: true },
  { id: "cabeus", lat: -84.9, lon: 324.5, areaKm2: 292, name: "Cabeus", icePriority: true },
  { id: "nobile", lat: -85.2, lon: 306.6, areaKm2: 96, name: "Nobile", icePriority: true },
  { id: "sverdrup", lat: -84.5, lon: 152, areaKm2: 397, name: "Sverdrup (Rozhdestvenskiy U)", icePriority: true },
  { id: "wiechert_j", lat: -84.7, lon: 268, areaKm2: 97, name: "Wiechert J (Hermite)", icePriority: true },
  { id: "malapert", lat: -85.5, lon: 0, areaKm2: 80, name: "Malapert massif region", icePriority: true },
  // LROC South Pole PSR list (SP_*) – representative sample
  { id: "SP_800780", lat: -80.078, lon: 45.663, areaKm2: 37.076, name: "Scott", icePriority: false },
  { id: "SP_802260", lat: -80.226, lon: 42.429, areaKm2: 99.558, name: "Scott E", icePriority: false },
  { id: "SP_804240", lat: -80.424, lon: 135.485, areaKm2: 155.074, name: "Nefed'ev", icePriority: false },
  { id: "SP_804520", lat: -80.452, lon: 40.176, areaKm2: 10.001, name: "Scott E", icePriority: false },
  { id: "SP_804590", lat: -80.459, lon: 308.878, areaKm2: 15.011, icePriority: false },
  { id: "SP_805200", lat: -80.52, lon: 60.2, areaKm2: 45, icePriority: false },
  { id: "SP_806100", lat: -80.61, lon: 180.5, areaKm2: 88, icePriority: false },
  { id: "SP_808000", lat: -80.8, lon: 310.2, areaKm2: 52, icePriority: false },
  { id: "SP_810200", lat: -81.02, lon: 90.4, areaKm2: 68, icePriority: false },
  { id: "SP_812500", lat: -81.25, lon: 270.1, areaKm2: 110, name: "Lovelace E", icePriority: false },
  { id: "SP_815000", lat: -81.5, lon: 120.98, areaKm2: 137, name: "Plaskett V", icePriority: false },
  { id: "SP_818200", lat: -81.82, lon: 213.99, areaKm2: 256, name: "Rozhdestvenskiy K", icePriority: false },
  { id: "SP_820300", lat: -82.03, lon: 278.38, areaKm2: 317, name: "Sylvester", icePriority: false },
  { id: "SP_823700", lat: -82.37, lon: 162.07, areaKm2: 94, name: "Plaskett U", icePriority: false },
  { id: "SP_824700", lat: -82.47, lon: 149.71, areaKm2: 81, name: "Hevesy", icePriority: false },
  { id: "SP_830700", lat: -83.07, lon: 82.43, areaKm2: 108, name: "Nansen", icePriority: false },
  { id: "SP_843200", lat: -84.32, lon: 62.47, areaKm2: 253, name: "Nansen F", icePriority: false },
  { id: "SP_845600", lat: -84.56, lon: 153.13, areaKm2: 397, name: "Rozhdestvenskiy U", icePriority: false },
  { id: "SP_847000", lat: -84.70, lon: 266.35, areaKm2: 97, name: "Hermite", icePriority: false },
  { id: "SP_848100", lat: -84.81, lon: 251.48, areaKm2: 292, name: "Lenard", icePriority: false },
  { id: "SP_856700", lat: -85.67, lon: 158.06, areaKm2: 87, name: "Rozhdestvenskiy U", icePriority: false },
  { id: "SP_860600", lat: -86.06, lon: 37.34, areaKm2: 120, name: "Fibiger", icePriority: false },
  { id: "SP_867100", lat: -86.71, lon: 131.12, areaKm2: 34, name: "Bosch", icePriority: false },
  { id: "SP_877400", lat: -87.74, lon: 123.96, areaKm2: 24, name: "Bosch / Whipple", icePriority: false },
  { id: "SP_879500", lat: -87.95, lon: 307.68, areaKm2: 212, name: "Hermite A", icePriority: false },
  { id: "SP_891500", lat: -89.15, lon: 119.54, areaKm2: 87, name: "Whipple", icePriority: false },
];

/** Artemis III candidate landing regions (approximate centers) for reference */
export const ARTEMIS_III_REGIONS = [
  { name: "Peak near Cabeus B", lat: -82.5, lon: 324 },
  { name: "Haworth", lat: -87.5, lon: 355 },
  { name: "Malapert Massif", lat: -85.5, lon: 0 },
  { name: "Mons Mouton", lat: -84.5, lon: 0 },
  { name: "Nobile Rim 1", lat: -85.2, lon: 306 },
  { name: "Nobile Rim 2", lat: -85.2, lon: 308 },
  { name: "de Gerlache Rim 2", lat: -88.5, lon: 270 },
  { name: "Slater Plain", lat: -88.2, lon: 0 },
] as const;
