"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

class EntangledBrandedThreads {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  duration: number = 3500;
  startTime: number | null = null;
  animId: number | null = null;
  threads: any[];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.threads = [
      { colorR: 204, colorG: 0, colorB: 0, width: 38, offsetX: 0, offsetY: 0, wavePhase: 0, label: 'THRDLY', labelSpacing: 320 },
      { colorR: 255, colorG: 30, colorB: 30, width: 30, offsetX: 40, offsetY: 30, wavePhase: Math.PI * .33, label: 'THRDLY — S/S 2026 ✦', labelSpacing: 460 },
      { colorR: 139, colorG: 0, colorB: 0, width: 26, offsetX: -35, offsetY: -25, wavePhase: Math.PI * .66, label: 'THRDLY', labelSpacing: 290 }
    ];
  }

  buildPath(thread: any, progress: number, time: number) {
    const W = this.canvas.width, H = this.canvas.height;
    const sx = -120, sy = H + 120, ex = W + 120, ey = -120;
    const segments = 480, points = [];
    for (let i = segments; i >= 0; i--) {
      const t = progress - (i / segments) * 1.4;
      if (t < -0.35 || t > progress + 0.25) continue;
      const bx = sx + (ex - sx) * t, by = sy + (ey - sy) * t;
      const w1 = Math.sin((t * 10 + time * .003 + thread.wavePhase) * Math.PI) * 32;
      const w2 = Math.sin((t * 7 + time * .002 + thread.wavePhase) * Math.PI) * 22;
      const w3 = Math.sin((t * 13 + time * .004 + thread.wavePhase) * Math.PI) * 11;
      const wave = w1 + w2 + w3;
      const angle = Math.atan2(ey - sy, ex - sx);
      const px = bx + Math.cos(angle + Math.PI / 2) * wave + thread.offsetX;
      const py = by + Math.sin(angle + Math.PI / 2) * wave + thread.offsetY;
      let op = 1;
      if (t < 0) op = Math.max(0, 1 + t * 2.8);
      else if (t > progress - .3) op = Math.max(0, (progress - t) / .3);
      points.push({ x: px, y: py, op, t });
    }
    return points;
  }

  drawThread(thread: any, progress: number, time: number) {
    const pts = this.buildPath(thread, progress, time);
    if (pts.length < 2) return;
    const r = thread.colorR, g = thread.colorG, b = thread.colorB;
    const W = thread.width;

    this.ctx.save();
    this.ctx.lineWidth = W + 50; this.ctx.lineCap = 'round'; this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = `rgba(${r},${g},${b},0.07)`;
    this.ctx.beginPath(); pts.forEach((p, i) => i === 0 ? this.ctx.moveTo(p.x, p.y) : this.ctx.lineTo(p.x, p.y)); this.ctx.stroke();
    this.ctx.restore();

    this.ctx.save();
    this.ctx.lineWidth = W + 18; this.ctx.lineCap = 'round'; this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = 'rgba(8,0,0,0.45)';
    this.ctx.beginPath(); pts.forEach((p, i) => i === 0 ? this.ctx.moveTo(p.x, p.y) : this.ctx.lineTo(p.x, p.y)); this.ctx.stroke();
    this.ctx.restore();

    this.ctx.save(); this.ctx.lineCap = 'round'; this.ctx.lineJoin = 'round';
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b2 = pts[i + 1], avg = (a.op + b2.op) / 2;
      this.ctx.strokeStyle = `rgba(${r},${g},${b},${avg * .88})`;
      this.ctx.lineWidth = W * (.52 + a.op * .48);
      this.ctx.beginPath(); this.ctx.moveTo(a.x, a.y); this.ctx.lineTo(b2.x, b2.y); this.ctx.stroke();
    }
    this.ctx.restore();

    // ── TEXTURE PASSES ──
    this.ctx.save(); this.ctx.lineCap = 'round';
    for (let o = -W * .3; o <= W * .3; o += 2.2) {
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b2 = pts[i + 1], avg = (a.op + b2.op) / 2;
        const ang = Math.atan2(b2.y - a.y, b2.x - a.x);
        const nx = Math.cos(ang + Math.PI / 2), ny = Math.sin(ang + Math.PI / 2);
        const vary = .5 + .5 * Math.sin(i * .4 + o * .8);
        this.ctx.strokeStyle = `rgba(${Math.min(255, r + 30)},${Math.min(255, g + 10)},${Math.min(255, b + 10)},${avg * .18 * vary})`;
        this.ctx.lineWidth = .9;
        this.ctx.beginPath();
        this.ctx.moveTo(a.x + nx * o, a.y + ny * o);
        this.ctx.lineTo(b2.x + nx * o, b2.y + ny * o);
        this.ctx.stroke();
      }
    }
    this.ctx.restore();

    this.drawLabel(pts, thread, time);
  }

  drawLabel(pts: any[], thread: any, time: number) {
    if (pts.length < 4) return;
    const fontSize = Math.max(9, thread.width * .36), spacing = thread.labelSpacing;
    this.ctx.save();
    this.ctx.font = `900 ${fontSize}px 'Segoe UI',Arial,sans-serif`;
    this.ctx.textBaseline = 'middle'; this.ctx.textAlign = 'left';
    const arcLen = [0];
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x, dy = pts[i].y - pts[i - 1].y;
      arcLen.push(arcLen[i - 1] + Math.sqrt(dx * dx + dy * dy));
    }
    const total = arcLen[arcLen.length - 1];
    const ptAt = (s: number) => {
      if (s <= 0) return pts[0]; if (s >= total) return pts[pts.length - 1];
      let lo = 0, hi = arcLen.length - 1;
      while (lo < hi - 1) { const m = (lo + hi) >> 1; arcLen[m] <= s ? lo = m : hi = m; }
      const f = (s - arcLen[lo]) / (arcLen[hi] - arcLen[lo] || 1);
      return { x: pts[lo].x + (pts[hi].x - pts[lo].x) * f, y: pts[lo].y + (pts[hi].y - pts[lo].y) * f, op: pts[lo].op + (pts[hi].op - pts[lo].op) * f };
    };
    const off = (time * .012) % spacing;
    for (let s = -spacing + off; s < total + spacing; s += spacing) {
      let cursor = s;
      for (let ci = 0; ci < thread.label.length; ci++) {
        const ch = thread.label[ci]; const chW = this.ctx.measureText(ch).width + 2.5;
        const mid = cursor + chW / 2;
        if (mid < 0 || mid > total) { cursor += chW; continue; }
        const p0 = ptAt(mid - 1), p1 = ptAt(mid + 1), pM = ptAt(mid);
        const ang = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        const op = pM.op; if (op < .04) { cursor += chW; continue; }
        this.ctx.save(); this.ctx.translate(pM.x, pM.y); this.ctx.rotate(ang);
        this.ctx.fillStyle = `rgba(40,0,0,${op * .65})`; this.ctx.fillText(ch, -chW / 2 + 1.2, 1.2);
        this.ctx.fillStyle = `rgba(255,255,255,${op * .9})`; this.ctx.fillText(ch, -chW / 2, 0);
        this.ctx.restore(); cursor += chW;
      }
    }
    this.ctx.restore();
  }

  frame(ts: number) {
    if (!this.startTime) this.startTime = ts;
    const e = ts - this.startTime, progress = Math.min(e / this.duration, 1);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const t of this.threads) this.drawThread(t, progress, e);
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
      }, 3600);
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
        background: '#000',
        zIndex: 8000,
        pointerEvents: 'none',
        display: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        id="threadCanvas"
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
