import type { Product } from "@/data/products";

/** Lightweight gradient + emoji artwork so the template ships with no image assets. */
export function ProductArt({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div
      className={`grid place-items-center bg-gradient-to-br ${product.gradient} ${className}`}
      aria-hidden="true"
    >
      <span className="text-6xl drop-shadow-sm">{product.emoji}</span>
    </div>
  );
}
