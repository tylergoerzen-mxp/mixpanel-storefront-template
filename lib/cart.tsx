"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { EVENTS, track } from "@/lib/analytics";

export type CartLine = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  /** True once the cart has been restored from localStorage. Effects that read
   * the cart (e.g. revenue events) must wait for this to avoid reading [] on
   * the first render before hydration runs. */
  hydrated: boolean;
  add: (product: Product, source?: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "storefront.cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Restore the cart from localStorage on first mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      // Ignore malformed storage and start with an empty cart.
    }
    setHydrated(true);
  }, []);

  // Persist on every change (after the initial hydration).
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.product.price, 0);

    return {
      lines,
      count,
      subtotal,
      hydrated,
      add: (product, source = "unknown") => {
        setLines((current) => {
          const existing = current.find((line) => line.product.id === product.id);
          if (existing) {
            return current.map((line) =>
              line.product.id === product.id
                ? { ...line, quantity: line.quantity + 1 }
                : line,
            );
          }
          return [...current, { product, quantity: 1 }];
        });
        track(EVENTS.PRODUCT_ADDED, {
          product_id: product.id,
          product_name: product.name,
          category: product.category,
          price: product.price,
          source,
        });
      },
      remove: (productId) => {
        const line = lines.find((item) => item.product.id === productId);
        setLines((current) => current.filter((item) => item.product.id !== productId));
        if (line) {
          track(EVENTS.PRODUCT_REMOVED, {
            product_id: line.product.id,
            product_name: line.product.name,
            category: line.product.category,
            price: line.product.price,
          });
        }
      },
      clear: () => setLines([]),
    };
  }, [lines, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
