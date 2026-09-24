"use client";

import { useSyncExternalStore } from "react";

/* --------------------------------------------------------------------------
   prefers-reduced-motion
   -------------------------------------------------------------------------- */

const reducedQuery = "(prefers-reduced-motion: reduce)";

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(reducedQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );
}

/* --------------------------------------------------------------------------
   Tamanho da viewport (estável em mobile)
   A barra de endereço do navegador mobile altera `innerHeight` durante o
   scroll; ignoramos variações pequenas de altura para o enquadramento da
   experiência 3D não "tremer".
   -------------------------------------------------------------------------- */

interface Viewport {
  w: number;
  h: number;
}

const SERVER_VIEWPORT: Viewport = { w: 1280, h: 800 };
let viewport: Viewport = SERVER_VIEWPORT;
let measured = false;

function measure(force = false) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (!measured || force || w !== viewport.w || Math.abs(h - viewport.h) > 140) {
    viewport = { w, h };
    measured = true;
    return true;
  }
  return false;
}

function subscribeViewport(cb: () => void) {
  const onResize = () => {
    if (measure()) cb();
  };
  if (measure(true)) cb();
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
  return () => {
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
  };
}

export function useViewport(): Viewport {
  return useSyncExternalStore(
    subscribeViewport,
    () => {
      if (!measured) measure(true);
      return viewport;
    },
    () => SERVER_VIEWPORT,
  );
}
