import { useSyncExternalStore } from "react";

export type BottleQualityTier = "low" | "medium" | "high";

/** Hero + customizer: target spin rate (rad/s), same as legacy `rotation.y = t * 0.28`. */
export const BOTTLE_ROTATION_RAD_PER_SEC = 0.28;

/**
 * Effective auto-rotation speed. Narrow viewports (typical phones) get a small boost so
 * perceived spin matches desktop; not tied to full "low" quality tier (avoids fighting
 * `prefers-reduced-motion`).
 */
export function getBottleRotationRadPerSec(): number {
  if (typeof window === "undefined") return BOTTLE_ROTATION_RAD_PER_SEC;
  const narrow = window.matchMedia("(max-width: 640px)").matches;
  return BOTTLE_ROTATION_RAD_PER_SEC * (narrow ? 1.12 : 1);
}

/** Exponential smoothing for customizer mesh vs `targetRotation` — snappier on narrow screens. */
export function getBottleRotationFollowSharpness(): number {
  if (typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches) {
    return 16;
  }
  return 10;
}

/** Geometry, renderer, and animation settings for procedural bottle scenes. */
export type BottleQualityConfig = {
  tier: BottleQualityTier;
  latheBottle: number;
  latheWater: number;
  labelCylinder: number;
  capCylinder: number;
  capRidges: number;
  dropletCount: number;
  dropletSphereWidth: number;
  dropletSphereHeight: number;
  labelCanvasW: number;
  labelCanvasH: number;
  maxPixelRatio: number;
  antialias: boolean;
};

function resolveTier(): BottleQualityTier {
  if (typeof window === "undefined") return "high";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";
  if (window.matchMedia("(max-width: 640px)").matches) return "low";
  if (window.matchMedia("(max-width: 1024px)").matches) return "medium";
  return "high";
}

/**
 * Call once per Three.js scene init (inside useEffect). Tier is fixed for that mount
 * so geometry does not thrash on resize; remount is rare for full-page sections.
 */
export function getBottleQualityConfig(): BottleQualityConfig {
  const tier = resolveTier();
  if (tier === "low") {
    return {
      tier,
      latheBottle: 32,
      latheWater: 28,
      labelCylinder: 32,
      capCylinder: 32,
      capRidges: 12,
      dropletCount: 5,
      dropletSphereWidth: 4,
      dropletSphereHeight: 6,
      labelCanvasW: 512,
      labelCanvasH: 320,
      maxPixelRatio: 1,
      antialias: false,
    };
  }
  if (tier === "medium") {
    return {
      tier,
      latheBottle: 48,
      latheWater: 40,
      labelCylinder: 48,
      capCylinder: 48,
      capRidges: 18,
      dropletCount: 12,
      dropletSphereWidth: 5,
      dropletSphereHeight: 8,
      labelCanvasW: 768,
      labelCanvasH: 480,
      maxPixelRatio: 1.25,
      antialias: true,
    };
  }
  return {
    tier,
    latheBottle: 64,
    latheWater: 50,
    labelCylinder: 64,
    capCylinder: 64,
    capRidges: 24,
    dropletCount: 20,
    dropletSphereWidth: 5,
    dropletSphereHeight: 8,
    labelCanvasW: 1024,
    labelCanvasH: 640,
    maxPixelRatio: 1.5,
    antialias: true,
  };
}

/** Hero / UI: fewer floating particles on narrow viewports. */
export function useHeroParticleCount(): number {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(max-width: 768px)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => (window.matchMedia("(max-width: 768px)").matches ? 5 : 20),
    () => 20
  );
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}
