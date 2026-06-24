import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductArt } from "@/components/ProductArt";
import { TrackOnView } from "@/components/TrackOnView";
import { EVENTS } from "@/lib/analytics";
import { getProduct, getProducts } from "@/lib/products";

// Pre-render the bundled catalog at build time; unknown slugs render on demand.
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div>
      <TrackOnView
        name={EVENTS.PRODUCT_VIEWED}
        props={{
          product_id: product.id,
          product_name: product.name,
          category: product.category,
          price: product.price,
        }}
      />

      <Link href="/" className="mb-6 inline-block text-sm text-slate-500 hover:text-slate-900">
        ← Back to shop
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ProductArt product={product} className="aspect-square w-full rounded-3xl" />
        <div className="flex flex-col">
          <span className="text-sm font-medium uppercase tracking-wide text-brand">
            {product.category}
          </span>
          <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-2xl font-semibold">${product.price}</p>
          <p className="mt-4 leading-relaxed text-slate-600">{product.description}</p>
          <div className="mt-8">
            <AddToCartButton product={product} source="product_detail" className="px-8 py-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
