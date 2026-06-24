"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function Header() {
  const { count, hydrated } = useCart();
  // Only show the badge after hydration so the count doesn't flicker in.
  const showBadge = hydrated && count > 0;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white">
            N
          </span>
          Northwind
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-slate-900">
            Shop
          </Link>
          <Link
            href="/cart"
            className="relative rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark"
          >
            Cart
            {showBadge && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-slate-900 px-1 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
