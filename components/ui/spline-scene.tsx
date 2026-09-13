"use client";

import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className = "" }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="spline-loading" aria-label="Chargement de la scène 3D">
          <span className="spline-loader" />
          <small>Loading 3D</small>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
