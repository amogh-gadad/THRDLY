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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds
    const interval = 20; // 20ms update
    const steps = duration / interval;
    const increment = 100 / steps;

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
    }, interval);

    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 150);

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
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Rapid Image Sequence */}
          <div className="relative w-64 h-80 mb-8 overflow-hidden grayscale contrast-125 border border-white/10">
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
          </div>

          {/* Counter and Branding */}
          <div className="flex flex-col items-center">
            <div className="text-6xl font-bold tracking-tighter mb-2 tabular-nums">
              {Math.floor(count).toString().padStart(3, "0")}
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent">
              THRDLY® Embroidery
            </div>
          </div>

          {/* Progress Bar (Minimal) */}
          <div className="absolute bottom-0 left-0 h-1 bg-accent transition-all duration-75" style={{ width: `${count}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
