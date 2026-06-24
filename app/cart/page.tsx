"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { EVENTS, identifyUser, track } from "@/lib/analytics";

export default function CartPage() {
  const { lines, subtotal, count, hydrated, remove } = useCart();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const cartViewFired = useRef(false);

  // Fire "Cart Viewed" once, after hydration, so item_count/subtotal reflect a
  // saved cart rather than the empty pre-hydration state.
  useEffect(() => {
    if (!hydrated || cartViewFired.current) return;
    cartViewFired.current = true;
    track(EVENTS.CART_VIEWED, { item_count: count, subtotal });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // Avoid flashing the empty-cart state before the saved cart is restored.
  if (!hydrated) return null;

  async function handleCheckout() {
    setLoading(true);

    // Tie subsequent events to this shopper if they gave us an email.
    if (email) {
      identifyUser(email, { $email: email });
    }

    track(EVENTS.CHECKOUT_STARTED, {
      item_count: count,
      subtotal,
      items: lines.map((line) => line.product.name),
    });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          lines: lines.map((line) => ({
            id: line.product.id,
            name: line.product.name,
            price: line.product.price,
            quantity: line.quantity,
          })),
        }),
      });
      const data = (await response.json()) as { mode: string; url?: string };

      if (data.mode === "stripe" && data.url) {
        window.location.href = data.url; // Hand off to Stripe Checkout.
        return;
      }
      // Demo mode: no real charge, straight to the confirmation page.
      router.push("/checkout/success?demo=1");
    } catch {
      router.push("/checkout/success?demo=1");
    }
  }

  if (count === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Add a few products to see the checkout funnel fire.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Your cart</h1>

      <ul className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {lines.map((line) => (
          <li key={line.product.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-semibold">{line.product.name}</p>
              <p className="text-sm text-slate-500">
                ${line.product.price} × {line.quantity}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold">${line.product.price * line.quantity}</span>
              <button
                type="button"
                onClick={() => remove(line.product.id)}
                className="text-sm text-slate-400 hover:text-rose-500"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between text-lg font-semibold">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>

        <label className="mb-1 block text-sm font-medium text-slate-600" htmlFor="email">
          Email (optional — used to identify you in Mixpanel)
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
        />

        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Starting checkout…" : "Checkout"}
        </button>
      </div>
    </div>
  );
}
