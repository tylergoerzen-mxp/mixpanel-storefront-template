import Link from "next/link";
import type { Product } from "@/data/products";
import { AddToCartButton } from "./AddToCartButton";
import { ProductArt } from "./ProductArt";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="block">
        <ProductArt product={product} className="aspect-[4/3] w-full" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="font-semibold leading-tight hover:text-brand"
          >
            {product.name}
          </Link>
          <span className="shrink-0 font-semibold">${product.price}</span>
        </div>
        <p className="line-clamp-2 text-sm text-slate-500">{product.description}</p>
        <div className="mt-auto pt-3">
          <AddToCartButton product={product} source="product_grid" className="w-full" />
        </div>
      </div>
    </div>
  );
}
