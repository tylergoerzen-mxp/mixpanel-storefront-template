import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSiteUrl } from "@/lib/config";

type CheckoutLine = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

/**
 * Creates a Stripe Checkout Session when STRIPE_SECRET_KEY is configured.
 * Otherwise responds in "demo" mode so the storefront works end-to-end with no
 * payment setup — the client then routes straight to the confirmation page and
 * still fires the "Order Completed" revenue event into Mixpanel.
 */
export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const body = (await request.json()) as { email?: string; lines: CheckoutLine[] };
  const lines = Array.isArray(body.lines) ? body.lines : [];

  if (!secretKey || lines.length === 0) {
    return NextResponse.json({ mode: "demo" });
  }

  try {
    const stripe = new Stripe(secretKey);
    const siteUrl = getSiteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(line.price * 100),
          product_data: { name: line.name },
        },
      })),
      customer_email: body.email || undefined,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
    });

    return NextResponse.json({ mode: "stripe", url: session.url });
  } catch (error) {
    // Never block the demo on a Stripe misconfiguration — fall back gracefully.
    console.error("[checkout] Stripe error, falling back to demo mode:", error);
    return NextResponse.json({ mode: "demo" });
  }
}
