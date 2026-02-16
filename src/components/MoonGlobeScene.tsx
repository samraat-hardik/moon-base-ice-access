"use client";

import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import type { Group } from "three";
import type { PSRRecord } from "@/data/psr-south-pole";
import { COLOR_HIGH_ICE, COLOR_PSR } from "@/lib/globe-colors";

/** Load via same-origin API to avoid CORS when fetching NASA GLB from browser. */
const MOON_MODEL_URL = "/api/moon-model";

const MOON_RADIUS = 1.21; // slightly above surface (model scale 1.2) to avoid z-fight

/** Convert lat (deg -90..0), lon (0..360) to position on unit sphere (Y up, south = -Y). */
function latLonToPosition(lat: number, lon: number, radius: number) {
  const deg = Math.PI / 180;
  const phi = lat * deg;
  const theta = lon * deg;
  const y = radius * Math.sin(phi);
  const x = radius * Math.cos(phi) * Math.cos(theta);
  const z = radius * Math.cos(phi) * Math.sin(theta);
  return [x, y, z] as const;
}

function PSRMarkers({ psrs }: { psrs: PSRRecord[] }) {
  return (
    <group>
      {psrs.map((psr) => {
        const [x, y, z] = latLonToPosition(psr.lat, psr.lon, MOON_RADIUS);
        const isHigh = psr.icePriority;
        const size = 0.008 + Math.min(psr.areaKm2 / 400, 0.015);
        return (
          <mesh key={psr.id} position={[x, y, z]}>
            <sphereGeometry args={[size, 12, 12]} />
            <meshBasicMaterial
              color={isHigh ? COLOR_HIGH_ICE : COLOR_PSR}
              transparent
              opacity={isHigh ? 0.95 : 0.75}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export type GlobeView = "globe" | "south-pole";

function MoonModel({ view }: { view: GlobeView }) {
  const { scene } = useGLTF(MOON_MODEL_URL);
  const ref = useRef<Group>(null);
  const rotationX = view === "south-pole" ? Math.PI / 2 : 0;

  return (
    <group ref={ref} scale={1.2} rotation={[rotationX, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Scene({
  view,
  psrs,
}: {
  view: GlobeView;
  psrs: PSRRecord[];
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-3, -2, -2]} intensity={0.4} />
      <Suspense
        fallback={
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#2c2c2e" wireframe />
          </mesh>
        }
      >
        <MoonModel view={view} />
      </Suspense>
      {psrs.length > 0 && <PSRMarkers psrs={psrs} />}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minDistance={2}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={view === "south-pole" ? 0.08 : 0.15}
      />
    </>
  );
}

interface MoonGlobeSceneProps {
  defaultView?: GlobeView;
  /** PSRs to show as water-ice / probability markers on the globe. */
  psrs?: PSRRecord[];
  /** If true, canvas fills the viewport (full-screen mode). */
  fullScreen?: boolean;
}

export function MoonGlobeScene({
  defaultView = "globe",
  psrs = [],
  fullScreen = false,
}: MoonGlobeSceneProps = {}) {
  const BG_MAIN = "#1a1a1c"; // lunar-shadow, same as main page body

  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-40 bg-lunar-shadow"
          : "w-full h-[70vh] min-h-[400px] rounded-xl overflow-hidden bg-lunar-surface border border-white/10"
      }
    >
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={[BG_MAIN]} />
        <Scene view={defaultView} psrs={psrs} />
      </Canvas>
    </div>
  );
}
