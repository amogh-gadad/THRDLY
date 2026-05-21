"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

class EntangledBrandedThreads {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  duration: number = 3200;
  startTime: number | null = null;
  animId: number | null = null;
  threads: any[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.threads = [
      { color: '#cc0000', secondary: '#880000', width: 32, offsetX: 0, offsetY: 0, wavePhase: 0, label: 'THRDLY', labelSpacing: 320, shimmer: 0 },
      { color: '#ff1e1e', secondary: '#aa0000', width: 24, offsetX: 50, offsetY: 40, wavePhase: Math.PI * .33, label: 'THRDLY — S/S 2026 ✦', labelSpacing: 480, shimmer: 1 },
      { color: '#8b0000', secondary: '#440000', width: 20, offsetX: -45, offsetY: -35, wavePhase: Math.PI * .66, label: 'THRDLY', labelSpacing: 290, shimmer: 2 }
    ];
  }

  buildPath(thread: any, progress: number, time: number) {
    const W = this.canvas.width, H = this.canvas.height;
    const sx = -150, sy = H + 150, ex = W + 150, ey = -150;
    const segments = 300, points = [];

    // Stretch progress to ensure full coverage
    const tProgress = progress * 1.5 - 0.25;

    for (let i = segments; i >= 0; i--) {
      const t = tProgress - (i / segments) * 1.2;
      if (t < -0.4 || t > tProgress + 0.2) continue;

      const bx = sx + (ex - sx) * t;
      const by = sy + (ey - sy) * t;

      const w1 = Math.sin((t * 8 + time * .002 + thread.wavePhase) * Math.PI) * 45;
      const w2 = Math.sin((t * 5 + time * .001 + thread.wavePhase) * Math.PI) * 25;
      const wave = w1 + w2;

      const angle = Math.atan2(ey - sy, ex - sx);
      const px = bx + Math.cos(angle + Math.PI / 2) * wave + thread.offsetX;
      const py = by + Math.sin(angle + Math.PI / 2) * wave + thread.offsetY;

      let op = 1;
      if (t < 0) op = Math.max(0, 1 + t * 2.5);
      else if (t > tProgress - .2) op = Math.max(0, (tProgress - t) / .2);

      points.push({ x: px, y: py, op, t });
    }
    return points;
  }

  drawThread(thread: any, progress: number, time: number) {
    const pts = this.buildPath(thread, progress, time);
    if (pts.length < 2) return;

    const W = thread.width;

    // 1. Shadow/Glow Pass
    this.ctx.save();
    this.ctx.lineWidth = W + 40;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = `${thread.color}15`; // Very low opacity glow
    this.ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? this.ctx.moveTo(p.x, p.y) : this.ctx.lineTo(p.x, p.y));
    this.ctx.stroke();
    this.ctx.restore();

    // 2. Base Thread Pass
    this.ctx.save();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b2 = pts[i + 1], avgOp = (a.op + b2.op) / 2;
      this.ctx.strokeStyle = thread.color;
      this.ctx.globalAlpha = avgOp;
      this.ctx.lineWidth = W;
      this.ctx.beginPath();
      this.ctx.moveTo(a.x, a.y);
      this.ctx.lineTo(b2.x, b2.y);
      this.ctx.stroke();
    }
    this.ctx.restore();

    // 3. STITCH TEXTURE PASS
    this.ctx.save();
    for (let i = 0; i < pts.length - 2; i += 2) {
      const a = pts[i], b = pts[i+1];
      if (a.op < 0.1) continue;

      const ang = Math.atan2(b.y - a.y, b.x - a.x);
      const nx = Math.cos(ang + Math.PI / 2), ny = Math.sin(ang + Math.PI / 2);

      // Draw diagonal stitch lines
      this.ctx.strokeStyle = thread.secondary;
      this.ctx.lineWidth = 1.5;
      this.ctx.globalAlpha = a.op * 0.6;

      for(let o = -W/2 + 2; o < W/2 - 2; o += 6) {
        this.ctx.beginPath();
        this.ctx.moveTo(a.x + nx * o - 3, a.y + ny * o - 3);
        this.ctx.lineTo(a.x + nx * (o + 4) + 3, a.y + ny * (o + 4) + 3);
        this.ctx.stroke();
      }
    }
    this.ctx.restore();

    // 4. SHIMMER/HIGHLIGHT PASS
    this.ctx.save();
    const shimmerPos = (time * 0.5 + thread.shimmer * 500) % 2000;
    for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const distFromShimmer = Math.abs((a.x + a.y) - shimmerPos);
        if (distFromShimmer < 100) {
            const shimmerOp = (1 - distFromShimmer / 100) * a.op * 0.4;
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 2;
            this.ctx.globalAlpha = shimmerOp;
            this.ctx.beginPath();
            this.ctx.moveTo(a.x, a.y);
            this.ctx.lineTo(pts[i+1].x, pts[i+1].y);
            this.ctx.stroke();
        }
    }
    this.ctx.restore();

    this.drawLabel(pts, thread, time);
  }

  drawLabel(pts: any[], thread: any, time: number) {
    if (pts.length < 10) return;
    const fontSize = Math.max(10, thread.width * 0.4);
    const spacing = thread.labelSpacing;

    this.ctx.save();
    this.ctx.font = `bold ${fontSize}px Helvetica, Arial, sans-serif`;
    this.ctx.textBaseline = 'middle';

    const arcLen = [0];
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x, dy = pts[i].y - pts[i - 1].y;
      arcLen.push(arcLen[i - 1] + Math.sqrt(dx * dx + dy * dy));
    }

    const total = arcLen[arcLen.length - 1];
    const ptAt = (s: number) => {
      if (s <= 0) return pts[0];
      if (s >= total) return pts[pts.length - 1];
      let lo = 0, hi = arcLen.length - 1;
      while (lo < hi - 1) {
        const m = (lo + hi) >> 1;
        arcLen[m] <= s ? lo = m : hi = m;
      }
      const f = (s - arcLen[lo]) / (arcLen[hi] - arcLen[lo] || 1);
      return {
        x: pts[lo].x + (pts[hi].x - pts[lo].x) * f,
        y: pts[lo].y + (pts[hi].y - pts[lo].y) * f,
        op: pts[lo].op + (pts[hi].op - pts[lo].op) * f
      };
    };

    const offset = (time * 0.08) % spacing;
    for (let s = -spacing + offset; s < total; s += spacing) {
      let cursor = s;
      for (const char of thread.label) {
        const charW = this.ctx.measureText(char).width + 2;
        const mid = cursor + charW / 2;
        if (mid > 0 && mid < total) {
          const p = ptAt(mid);
          const pNext = ptAt(mid + 1);
          const ang = Math.atan2(pNext.y - p.y, pNext.x - p.x);

          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate(ang);
          this.ctx.globalAlpha = p.op * 0.8;
          this.ctx.fillStyle = '#ffffff';
          this.ctx.fillText(char, -charW / 2, 0);
          this.ctx.restore();
        }
        cursor += charW;
      }
    }
    this.ctx.restore();
  }

  frame(ts: number) {
    if (!this.startTime) this.startTime = ts;
    const elapsed = ts - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Background fade-in
    this.ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(progress * 2, 0.95)})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (const t of this.threads) {
        this.drawThread(t, progress, elapsed);
    }

    if (progress < 1) {
      this.animId = requestAnimationFrame(t => this.frame(t));
    }
  }

  start() {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.startTime = null;
    this.animId = requestAnimationFrame(t => this.frame(t));
  }
}

export const ThreadTransition = forwardRef((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<EntangledBrandedThreads | null>(null);

  const startAnimation = () => {
    if (containerRef.current && engineRef.current) {
      containerRef.current.style.display = 'block';
      containerRef.current.style.pointerEvents = 'auto';
      engineRef.current.start();

      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
          containerRef.current.style.pointerEvents = 'none';
        }
      }, 3500);
    }
  };

  useImperativeHandle(ref, () => ({
    start: startAnimation
  }));

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      engineRef.current = new EntangledBrandedThreads(canvas);

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      const handleTrigger = () => {
          startAnimation();
      };
      window.addEventListener("triggerThreadTransition", handleTrigger);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("triggerThreadTransition", handleTrigger);
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      id="threadTransition"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'transparent',
        zIndex: 8000,
        pointerEvents: 'none',
        display: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
    </div>
  );
});

ThreadTransition.displayName = "ThreadTransition";
