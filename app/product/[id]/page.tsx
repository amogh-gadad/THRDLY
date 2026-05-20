"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const products = [
  {
    id: 1,
    name: "Crimson Rose Hoodie",
    price: "$85.00",
    category: "Heavyweight Fleece",
    description: "Our signature heavyweight fleece hoodie featuring a meticulous 50,000 stitch crimson rose embroidery on the chest. Designed for durability and unparalleled texture.",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1287&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Midnight Logo Tee",
    price: "$45.00",
    category: "Premium Cotton",
    description: "A premium 240gsm cotton tee with high-density 'THRDLY' logo embroidery in pitch black thread. Subtle yet striking tactile detail.",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1287&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Onyx Structured Cap",
    price: "$35.00",
    category: "Headwear",
    description: "Classic 6-panel structured cap. Features tonal black embroidery for a sleek, minimal aesthetic that focuses on the quality of the stitch.",
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1336&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Scarlet Thread Crewneck",
    price: "$75.00",
    category: "French Terry",
    description: "Soft French Terry crewneck accented with a single, continuous scarlet thread embroidery that flows across the shoulder and sleeve.",
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1372&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Vintage THRDLY Beanie",
    price: "$30.00",
    category: "Headwear",
    description: "Thick-knit cuffed beanie with a vintage-inspired THRDLY patch, secured with reinforced cross-stitching for a rugged, industrial look.",
    imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1287&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Embroidery Study 01",
    price: "$120.00",
    category: "Limited Edition",
    description: "An experimental piece showcasing various complex embroidery techniques. Limited to 50 pieces worldwide, each uniquely numbered by hand-stitch.",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1336&auto=format&fit=crop"
  }
];

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const productId = Number(params.id);
  const product = products.find(p => p.id === productId) || products[0];

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("triggerThreadTransition"));
    setTimeout(() => {
      router.push("/");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12 md:py-24">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-muted hover:text-accent transition-colors mb-12 uppercase text-xs tracking-widest font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="relative aspect-[4/5] border border-white/10 overflow-hidden bg-white/5">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-accent text-xs font-bold tracking-[0.3em] uppercase mb-4">
              {product.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 uppercase leading-none">
              {product.name}
            </h1>
            <p className="text-2xl font-medium text-accent mb-8">
              {product.price}
            </p>
            <p className="text-muted leading-relaxed mb-12 max-w-md">
              {product.description}
            </p>

            <button className="bg-white text-black py-4 px-8 font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
              Add to Bag
            </button>

            <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-muted mb-2 font-bold">Materials</h3>
                <p className="text-sm">Premium Sourced Cotton</p>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-widest text-muted mb-2 font-bold">Technique</h3>
                <p className="text-sm">High-Density Embroidery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
