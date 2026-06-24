"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart";

/**
 * Adds a product to the cart. The actual `Product Added to Cart` event is fired
 * inside the cart context so it stays consistent everywhere the button is used.
 * `source` records WHERE the add happened (grid vs. detail page) as an event
 * property — handy for breakdowns in Mixpanel.
 */
export function AddToCartButton({
  product,
  source,
  className = "",
}: {
  product: Product;
  source: string;
  className?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        add(product, source);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className={`rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark ${className}`}
    >
      {added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
