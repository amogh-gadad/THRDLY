import ProductCard from "./components/ProductCard";

const products = [
  {
    id: 1,
    name: "Crimson Rose Hoodie",
    price: "$85.00",
    category: "Heavyweight Fleece",
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1287&auto=format&fit=crop",
    hoverImageUrl: "https://images.unsplash.com/photo-1556821840-d1645567346b?q=80&w=1287&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Midnight Logo Tee",
    price: "$45.00",
    category: "Premium Cotton",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1287&auto=format&fit=crop",
    hoverImageUrl: "https://images.unsplash.com/photo-1503341503653-ff4f0ae9144b?q=80&w=1287&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Onyx Structured Cap",
    price: "$35.00",
    category: "Headwear",
    imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1336&auto=format&fit=crop",
    hoverImageUrl: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?q=80&w=1336&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Scarlet Thread Crewneck",
    price: "$75.00",
    category: "French Terry",
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1372&auto=format&fit=crop",
    hoverImageUrl: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?q=80&w=1372&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Vintage THRDLY Beanie",
    price: "$30.00",
    category: "Headwear",
    imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=1287&auto=format&fit=crop",
    hoverImageUrl: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1287&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Embroidery Study 01",
    price: "$120.00",
    category: "Limited Edition",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1336&auto=format&fit=crop",
    hoverImageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1336&auto=format&fit=crop"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="px-6 py-24 md:py-40 border-b border-white/10">
        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
            THREADED <br />
            <span className="text-accent">EXCELLENCE.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted max-w-2xl leading-relaxed">
            THRDLY® explores the intersection of traditional embroidery and modern streetwear.
            Each piece is a testament to the tactile beauty of the needle and thread.
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white/5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            category={product.category}
            imageUrl={product.imageUrl}
            hoverImageUrl={product.hoverImageUrl}
          />
        ))}
      </section>

      {/* Brand Statement */}
      <section className="px-6 py-32 flex flex-col md:flex-row items-end justify-between gap-12">
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold tracking-tighter mb-6 uppercase">Made to be worn. <br />Or judged. Or both.</h2>
          <p className="text-muted leading-relaxed uppercase text-xs tracking-widest font-bold">
            Created by the THRDLY team, this store and signature collection celebrates our
            collective creativity and passion for apparel. Carefully designed.
          </p>
        </div>
        <div className="text-8xl md:text-[12rem] font-bold tracking-tighter opacity-10 select-none">
          ©25
        </div>
      </section>
    </div>
  );
}
