import { ProductCard } from "@/components/ProductCard";
import { TrackOnView } from "@/components/TrackOnView";
import { getProducts } from "@/lib/products";
import { EVENTS } from "@/lib/analytics";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      <TrackOnView name={EVENTS.PRODUCT_LIST_VIEWED} props={{ count: products.length }} />

      <section className="mb-10 rounded-3xl bg-gradient-to-br from-brand to-brand-dark px-8 py-12 text-white">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-white/70">
          Northwind Goods
        </p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight">
          A demo storefront where every click streams into Mixpanel.
        </h1>
        <p className="mt-4 max-w-xl text-white/80">
          Browse, add to cart, and check out. Watch each interaction appear in the live panel —
          and in your Mixpanel project — in real time.
        </p>
      </section>

      <h2 className="mb-4 text-xl font-semibold">All products</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
