"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart";
import { EVENTS, track } from "@/lib/analytics";

function SuccessInner() {
  const { lines, subtotal, clear } = useCart();
  const searchParams = useSearchParams();
  const [orderId] = useState(() => `order_${Math.random().toString(36).slice(2, 10)}`);
  const fired = useRef(false);

  // Fire the revenue event exactly once, using the cart as it stands on arrival
  // (it survives the Stripe redirect via localStorage), then clear it.
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const isDemo = searchParams.get("demo") === "1";
    track(EVENTS.ORDER_COMPLETED, {
      order_id: orderId,
      revenue: subtotal,
      item_count: lines.reduce((sum, line) => sum + line.quantity, 0),
      items: lines.map((line) => line.product.name),
      mode: isDemo ? "demo" : "stripe",
    });
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="py-20 text-center">
      <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl">
        ✓
      </div>
      <h1 className="text-3xl font-bold">Order confirmed</h1>
      <p className="mt-2 text-slate-500">
        Order <span className="font-mono">{orderId}</span> is on its way.
      </p>
      <p className="mt-1 text-sm text-slate-400">
        An <span className="font-semibold">Order Completed</span> event with revenue just streamed
        into Mixpanel.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark"
      >
        Keep shopping
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessInner />
    </Suspense>
  );
}
