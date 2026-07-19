"use client";

import { useEffect, useRef } from "react";

/*
  使用 Canvas 绘制赛博朋克透视网格动画，
  模拟高速行驶时的后排第一视角。
*/
export default function SynthwaveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let offset = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const CYAN = "rgba(0, 245, 255,";
    const PINK = "rgba(255, 45, 120,";
    const VANISH_Y = 0.45;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const sky = ctx.createLinearGradient(0, 0, 0, H * VANISH_Y);
      sky.addColorStop(0, "#07071a");
      sky.addColorStop(0.6, "#0d0d2e");
      sky.addColorStop(1, "#1a0836");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H * VANISH_Y);

      const ground = ctx.createLinearGradient(0, H * VANISH_Y, 0, H);
      ground.addColorStop(0, "#050512");
      ground.addColorStop(1, "#0a0a1f");
      ctx.fillStyle = ground;
      ctx.fillRect(0, H * VANISH_Y, W, H);

      const vx = W / 2;
      const vy = H * VANISH_Y;
      const cols = 16;
      const rows = 20;
      const speed = 0.008;

      for (let i = 0; i <= cols; i++) {
        const ratio = i / cols;
        const gx = (ratio - 0.5) * W * 3;
        const alpha = 0.15 + ratio * (1 - ratio) * 0.6;
        const grad = ctx.createLinearGradient(vx, vy, vx + gx, H);

        grad.addColorStop(0, `${CYAN} 0)`);
        grad.addColorStop(1, `${CYAN} ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(vx + gx, H);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let i = 0; i < rows; i++) {
        const t = (i / rows + offset) % 1;
        const p = Math.pow(t, 2.5);
        const y = vy + (H - vy) * p;
        const xSpread = W * 1.5 * p;
        const alpha = Math.min(t * 1.4, 0.7);
        const color = i % 4 === 0 ? PINK : CYAN;

        ctx.beginPath();
        ctx.moveTo(vx - xSpread, y);
        ctx.lineTo(vx + xSpread, y);
        ctx.strokeStyle = `${color} ${alpha})`;
        ctx.lineWidth = p * 1.5;
        ctx.stroke();
      }

      const glowGrad = ctx.createLinearGradient(0, vy - 4, 0, vy + 4);
      glowGrad.addColorStop(0, `${PINK} 0)`);
      glowGrad.addColorStop(0.5, `${PINK} 0.9)`);
      glowGrad.addColorStop(1, `${PINK} 0)`);
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, vy - 1, W, 3);

      if (!reduceMotion) {
        offset = (offset + speed) % 1;
        animId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animId) {
        cancelAnimationFrame(animId);
      }
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ display: "block" }}
    />
  );
}
