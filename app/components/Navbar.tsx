"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const categories = [
  { name: "All Apparel", href: "/" },
  { name: "Hoodies & Sweats", href: "/category/hoodies" },
  { name: "T-Shirts", href: "/category/tees" },
  { name: "Headwear", href: "/category/headwear" },
  { name: "Accessories", href: "/category/accessories" },
];

export default function Navbar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleNav = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);

    // Only trigger transition and navigate if we're not already on the destination (except for home)
    // Dispatch event to trigger thread transition
    window.dispatchEvent(new CustomEvent("triggerThreadTransition"));

    // Wait for the animation to cover the screen before navigating
    setTimeout(() => {
      router.push(href);
    }, 1200);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
      <Link href="/" onClick={(e) => handleNav(e, "/")} className="text-xl font-bold tracking-tighter">
        THRDLY<span className="text-accent">®</span>
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link href="/" onClick={(e) => handleNav(e, "/")} className="hover:text-accent transition-colors uppercase hidden md:block">
          Shop
        </Link>
        <Link href="/bag" onClick={(e) => handleNav(e, "/bag")} className="flex items-center gap-1 hover:text-accent transition-colors uppercase">
          Bag (00)
        </Link>

        {/* Menu Dropdown Container */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-1 uppercase hover:text-accent transition-colors cursor-pointer group py-2"
          >
            Menu
            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-2 w-72 bg-background border border-border shadow-2xl overflow-hidden origin-top-right"
              >
                <div className="flex flex-col">
                  {/* Category Section */}
                  <div className="p-2 border-b border-border bg-card-bg/30">
                    <div className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-muted mb-1">
                      Collections
                    </div>
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={(e) => handleNav(e, cat.href)}
                        className="block px-4 py-3 text-sm hover:bg-accent hover:text-white transition-all uppercase tracking-widest font-bold"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>

                  {/* Settings Section */}
                  <div className="p-4 bg-background">
                     <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted mb-4">
                      Display Settings
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-widest font-bold">Theme</span>
                        <button
                          onClick={toggleTheme}
                          className="flex items-center gap-3 px-4 py-2 bg-card-bg border border-border hover:border-accent transition-colors cursor-pointer text-xs font-bold uppercase tracking-widest"
                        >
                          {theme === "dark" ? (
                            <>
                              <Moon className="w-3 h-3" />
                              Dark
                            </>
                          ) : (
                            <>
                              <Sun className="w-3 h-3 text-accent" />
                              Light
                            </>
                          )}
                        </button>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-border bg-card-bg/20 text-[9px] uppercase tracking-[0.3em] text-muted font-bold flex justify-between">
                    <span>Est. 2025</span>
                    <span>THRDLY®</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
