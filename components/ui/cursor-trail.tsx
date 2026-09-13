"use client";

import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(pointer: coarse)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: -100, y: -100, px: -100, py: -100 };
    const points = Array.from({ length: 16 }, () => ({ x: -100, y: -100 }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const move = (event: PointerEvent) => {
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      points[0].x += (pointer.x - points[0].x) * 0.34;
      points[0].y += (pointer.y - points[0].y) * 0.34;

      for (let i = 1; i < points.length; i += 1) {
        points[i].x += (points[i - 1].x - points[i].x) * 0.28;
        points[i].y += (points[i - 1].y - points[i].y) * 0.28;
      }

      for (let i = points.length - 1; i >= 0; i -= 1) {
        const p = points[i];
        const progress = 1 - i / points.length;
        const radius = 1.1 + progress * 2.8;
        const alpha = 0.02 + progress * 0.12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 244, 239, ${alpha})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, 9, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(245,244,239,.22)";
      ctx.lineWidth = 1;
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />;
}
