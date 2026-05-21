"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  category: string;
  imageUrl: string;
  hoverImageUrl?: string;
}

export default function ProductCard({ id, name, price, category, imageUrl, hoverImageUrl }: ProductCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position within the card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smoothing for the cursor following
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    // Calculate relative position within the card (0 to width/height)
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleClick = () => {
    // Dispatch event to trigger thread transition
    window.dispatchEvent(new CustomEvent("triggerThreadTransition"));

    // Wait for the animation to cover the screen before navigating
    setTimeout(() => {
      router.push(`/product/${id}`);
    }, 1200);
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={handleClick}
      className="group relative flex flex-col border-r border-b border-border overflow-hidden bg-background cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial="initial"
      whileHover="hover"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden cursor-none">
        {/* Base Image Container */}
        <div className="absolute inset-0 w-full h-full">
          <motion.div
            className="relative h-full w-full"
            variants={{
              initial: { scale: 1 },
              hover: { scale: 1.05 }
            }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
          >
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>
        </div>

        {/* Hover Image Container (Cross-fade) */}
        {hoverImageUrl && (
          <motion.div
            className="absolute inset-0 h-full w-full z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <motion.div
               className="relative h-full w-full"
               variants={{
                 initial: { scale: 1 },
                 hover: { scale: 1.05 }
               }}
               transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            >
              <Image
                src={hoverImageUrl}
                alt={`${name} hover view`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Custom Cursor / "View Details" Pill */}
        <motion.div
          className="pointer-events-none absolute left-0 top-0 z-20 flex items-center justify-center"
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          <motion.div
            className="whitespace-nowrap bg-white text-black px-5 py-2.5 rounded-full flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest shadow-2xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isHovered ? 1 : 0,
              opacity: isHovered ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          >
            View Details
            <ArrowUpRight className="w-3 h-3" />
          </motion.div>
        </motion.div>
      </div>

      <div className="p-6 flex flex-col gap-1 bg-background z-10">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium tracking-tight uppercase">{name}</h3>
          <span className="text-lg font-medium tracking-tight text-accent">{price}</span>
        </div>
        <p className="text-xs uppercase tracking-widest text-muted">{category}</p>
      </div>

      {/* Embroidery Detail accent */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <span className="bg-accent/10 text-accent text-[9px] px-2 py-1 border border-accent/20 font-bold uppercase tracking-widest backdrop-blur-md">
          Embroidery
        </span>
      </div>
    </motion.div>
  );
}
