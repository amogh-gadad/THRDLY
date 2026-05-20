"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop",
];

export default function Preloader() {
  const [count, setCount] = useState(0);
  const [stitches, setStitches] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const duration = 2500;
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;
    const stitchesFinal = 48290;
    const stitchesIncrement = stitchesFinal / steps;

    const counterInterval = setInterval(() => {
      setCount((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(counterInterval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return next;
      });
      setStitches((prev) => Math.min(stitchesFinal, prev + stitchesIncrement));
    }, interval);

    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 120);

    return () => {
      clearInterval(counterInterval);
      clearInterval(imageInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Grain Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          {/* Rapid Image Sequence with Stitch Overlay */}
          <div className="relative w-72 h-96 mb-12 overflow-hidden grayscale contrast-125 border border-white/5 shadow-2xl">
            {images.map((src, index) => (
              <img
                key={src}
                src={src}
                alt="Brand visual"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-75 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            {/* Thread Grid Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(circle, #fff 0.5px, transparent 0.5px)', backgroundSize: '4px 4px' }} />
          </div>

          {/* Counter and Branding */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-baseline gap-4 mb-2">
                <div className="text-8xl font-bold tracking-tighter tabular-nums leading-none">
                {Math.floor(count).toString().padStart(3, "0")}
                </div>
                <div className="text-xl font-bold text-accent italic">%</div>
            </div>

            <div className="space-y-1">
                <div className="text-[11px] uppercase tracking-[0.4em] font-bold text-white/40">
                Registering Pattern
                </div>
                <div className="text-xs uppercase tracking-[0.2em] font-bold text-accent">
                {Math.floor(stitches).toLocaleString()} STITCHES
                </div>
            </div>
          </div>

          {/* Thread Progress Bar */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/10">
            <motion.div
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${count}%` }}
                transition={{ duration: 0.1 }}
            />
          </div>

          <div className="absolute bottom-6 text-[9px] uppercase tracking-[0.5em] text-white/20 font-medium">
            THRDLY© Est. 2024 • Numerical Embroidery Systems
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
