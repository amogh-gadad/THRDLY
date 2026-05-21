"use client";

import { useTheme } from "./ThemeProvider";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="px-6 py-12 border-t border-border bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="mb-4">
            <img src="/logo.png" alt="THRDLY" className="h-8 md:h-10 w-auto dark:invert" />
          </div>
          <p className="text-xs text-muted uppercase tracking-widest">
            Numerical Embroidery Systems © 2024
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-[10px] font-bold uppercase tracking-[0.2em]">
          <div className="flex flex-col gap-3">
            <span className="text-muted">Legal</span>
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-muted">Social</span>
            <a href="#" className="hover:text-accent transition-colors">Instagram</a>
            <a href="#" className="hover:text-accent transition-colors">Twitter</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-muted">Support</span>
            <a href="#" className="hover:text-accent transition-colors">Contact</a>
            <a href="#" className="hover:text-accent transition-colors">Shipping</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
