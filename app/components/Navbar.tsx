"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleNav = (e: React.MouseEvent, href: string) => {
    e.preventDefault();

    // Dispatch event to trigger thread transition
    window.dispatchEvent(new CustomEvent("triggerThreadTransition"));

    // Wait for the animation to cover the screen before navigating
    setTimeout(() => {
      router.push(href);
    }, 1200);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 py-4 mix-blend-difference">
      <Link href="/" onClick={(e) => handleNav(e, "/")} className="text-xl font-bold tracking-tighter text-white">
        THRDLY<span className="text-accent">®</span>
      </Link>

      <div className="flex items-center gap-8 text-sm font-medium text-white">
        <Link href="/" onClick={(e) => handleNav(e, "/")} className="hover:text-accent transition-colors uppercase">
          Shop
        </Link>
        <Link href="/bag" onClick={(e) => handleNav(e, "/bag")} className="flex items-center gap-1 hover:text-accent transition-colors uppercase">
          Bag (00)
        </Link>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("triggerThreadTransition"))}
          className="uppercase hover:text-accent transition-colors cursor-pointer"
        >
          Menu
        </button>
      </div>
    </nav>
  );
}
