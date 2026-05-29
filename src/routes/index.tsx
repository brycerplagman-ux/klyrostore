import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, User, ChevronDown, Sparkles, Loader2 } from "lucide-react";
import { storefrontApiRequest, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "@/components/CartDrawer";

export const Route = createFileRoute("/")({
  component: Index,
});

const faqs = [
  { q: "What does buying Wholesalers get me?", a: "Buying a Wholesaler supplier gives you instant access to a trusted, reliable supplier that sells quality products at competitive prices." },
  { q: "How will I receive access to the Wholesalers?", a: "Once you complete your purchase, the supplier's contact is INSTANTLY sent via email and available on the order confirmation page." },
  { q: "How long does the Wholesalers take to ship?", a: "Shipping times range from 1-4 days. The most common shipment time is about a week. Ask the supplier for accurate times." },
  { q: "Do the Wholesalers ship worldwide?", a: "Yes! These suppliers ship worldwide, no matter where you're located." },
  { q: "How much do the Wholesalers charge for a product?", a: "The suppliers charge anywhere from $10–$100 per product. Some are cheaper than others." },
  { q: "What if I can't find my order?", a: "Your order is available for download right after checkout and emailed to you. If you can't find it, email us — we'll personally help." },
];

function Marquee() {
  const items = [
    "Marcus R. made $2,392 today • 18 mins ago",
    "1,350 members active now • Supplier from IG video",
    "Next price increase: Tonight at midnight",
    "$586 lost every day without access",
  ];
  return (
    <div className="border-b border-white/10 bg-gradient-to-r from-blue-600/20 via-fuchsia-600/20 to-blue-600/20 py-2 overflow-hidden">
      <div className="flex gap-12 whitespace-nowrap animate-[marquee_30s_linear_infinite] text-xs sm:text-sm font-medium">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            {t}
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-white/10 bg-black/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-4 h-20 flex items-center justify-between">
        <button aria-label="Search" className="text-white/80 hover:text-white">
          <Search className="h-5 w-5" />
        </button>
        <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-wider">
          <Sparkles className="h-6 w-6 text-blue-500" />
          <span className="bg-gradient-to-r from-white via-blue-300 to-white bg-clip-text text-transparent">
            klyroSupply
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <button aria-label="Account" className="text-white/80 hover:text-white p-2">
            <User className="h-5 w-5" />
          </button>
          <CartDrawer />
        </div>
      </div>
      <nav className="border-t border-white/10">
        <ul className="mx-auto max-w-6xl px-4 flex items-center justify-center gap-8 h-12 text-sm">
          <li><a className="text-white border-b-2 border-blue-500 pb-3" href="#">Home</a></li>
          <li><a className="text-white/70 hover:text-white" href="#products">Catalog</a></li>
          <li><a className="text-white/70 hover:text-white" href="#faq">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(37,99,235,0.25),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28 text-center">
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none">
          <span className="block text-white">GET ACCESS TO THE</span>
          <span className="block mt-2" style={{ WebkitTextStroke: "2px #3b82f6", color: "transparent" }}>
            BEST SUPPLIERS
          </span>
        </h1>
        <p className="mt-8 text-white/70 max-w-2xl mx-auto">
          Instant access to trusted, vetted wholesalers — start reselling and making real money today.
        </p>
        <a href="#products" className="inline-block mt-10 rounded-xl bg-blue-600 hover:bg-blue-500 transition px-8 py-4 font-bold text-white shadow-[0_0_40px_rgba(59,130,246,0.5)]">
          GET ACCESS!
        </a>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: ShopifyProduct }) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const price = product.node.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice;
  const onSale = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);

  const handleAdd = async () => {
    if (!variant) return;
    setAdding(true);
    try {
      await addItem({
        product,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
      });
    } finally {
      setAdding(false);
    }
  };


  return (
    <div className="group rounded-2xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 overflow-hidden hover:border-blue-500/50 transition">
      <div className="relative aspect-square overflow-hidden bg-black">
        {onSale && (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-rose-500 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
            Sale
          </span>
        )}
        {image ? (
          <img src={image.url} alt={image.altText || product.node.title} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-white/30 text-xs">No image</div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-sm font-bold tracking-wide text-white min-h-[2.5rem]">{product.node.title}</h3>
        <div className="mt-3 flex items-baseline gap-2">
          {onSale && (
            <span className="text-white/40 line-through text-sm">
              ${parseFloat(compareAt!.amount).toFixed(2)}
            </span>
          )}
          <span className={`font-bold ${onSale ? "text-rose-400" : "text-white"}`}>
            ${parseFloat(price.amount).toFixed(2)} <span className="text-white/50 text-xs">{price.currencyCode}</span>
          </span>
        </div>
        <button onClick={() => setOpen(!open)} className="mt-3 text-xs text-white/60 hover:text-white inline-flex items-center gap-1">
          DETAILS <ChevronDown className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} />
        </button>
        {open && product.node.description && (
          <p className="mt-2 text-xs text-white/60 leading-relaxed line-clamp-4">{product.node.description}</p>
        )}
        <button
          onClick={handleAdd}
          disabled={adding || !variant}
          className="mt-5 w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition py-3 font-bold text-sm flex items-center justify-center"
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : "GET ACCESS!"}
        </button>
      </div>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storefrontApiRequest(PRODUCTS_QUERY, { first: 24 })
      .then((data) => {
        if (data?.data?.products?.edges) setProducts(data.data.products.edges);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-16">
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-white/60">No products found</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => <ProductCard key={p.node.id} product={p} />)}
        </div>
      )}
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20">
      <h2 className="text-3xl sm:text-5xl font-black text-center mb-12">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold">
              <span>{f.q}</span>
              <ChevronDown className={`h-5 w-5 text-blue-400 transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <div className="px-5 pb-5 text-white/70 text-sm leading-relaxed">{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.25),transparent_60%)]" />
      <div className="relative mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-4xl sm:text-6xl font-black mb-4">Start Making Money Today</h2>
        <p className="text-white/70 mb-10">Get access to the world's best vendors.</p>
        <a href="#products" className="inline-block rounded-xl bg-blue-600 hover:bg-blue-500 transition px-10 py-5 font-bold text-lg shadow-[0_0_50px_rgba(59,130,246,0.6)]">
          GET ACCESS!!
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 text-center text-white/40 text-sm">
      © {new Date().getFullYear()} klyroSupply. All rights reserved.
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <Marquee />
      <Header />
      <main>
        <Hero />
        <Products />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
