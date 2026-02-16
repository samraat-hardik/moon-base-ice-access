"use client";

import Image from "next/image";
import { useState } from "react";

interface SpaceImageProps {
  src: string;
  alt: string;
  credit?: string;
  /** "hero" = fill container with object-cover; "card" = responsive card; "inline" = fixed small */
  variant?: "hero" | "card" | "inline";
  className?: string;
  priority?: boolean;
}

export function SpaceImage({
  src,
  alt,
  credit,
  variant = "card",
  className = "",
  priority = false,
}: SpaceImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`rounded-xl bg-lunar-surface border border-white/10 ${className}`}
        style={{
          minHeight: variant === "hero" ? 200 : variant === "card" ? 180 : 120,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        }}
      >
        <div className="flex items-center justify-center h-full text-white/40 text-sm">
          Image unavailable
        </div>
      </div>
    );
  }

  const isHero = variant === "hero";
  const isInline = variant === "inline";

  return (
    <figure className={className}>
      <div
        className={`relative overflow-hidden rounded-xl border border-white/10 ${
          isHero ? "min-h-[220px]" : isInline ? "h-28 w-full sm:w-44" : "aspect-video min-h-[180px]"
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={isHero ? "100vw" : isInline ? "176px" : "(max-width: 768px) 100vw, 50vw"}
          onError={() => setError(true)}
          priority={priority}
        />
        {isHero && (
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            aria-hidden
          />
        )}
      </div>
      {credit && (
        <figcaption className="mt-1.5 text-xs text-white/50 truncate">{credit}</figcaption>
      )}
    </figure>
  );
}
