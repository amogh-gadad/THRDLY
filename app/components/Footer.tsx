import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white px-6 py-20 border-t border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-4xl font-bold tracking-tighter mb-6">THRDLY</h2>
          <p className="max-w-xs text-muted leading-relaxed">
            Specializing in high-quality embroidery-based apparel.
            Crafted with precision, designed for the bold.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted">Links</h3>
          <Link href="/work" className="hover:text-accent transition-colors">Work</Link>
          <Link href="/services" className="hover:text-accent transition-colors">Services</Link>
          <Link href="/about" className="hover:text-accent transition-colors">About</Link>
          <Link href="/careers" className="hover:text-accent transition-colors">Careers</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted">Social</h3>
          <Link href="#" className="hover:text-accent transition-colors">Instagram</Link>
          <Link href="#" className="hover:text-accent transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-accent transition-colors">Dribbble</Link>
          <Link href="#" className="hover:text-accent transition-colors">LinkedIn</Link>
        </div>
      </div>

      <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted uppercase tracking-widest">
        <p>© {year} THRDLY ALL RIGHTS RESERVED</p>
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link>
        </div>
      </div>
    </footer>
  );
}
