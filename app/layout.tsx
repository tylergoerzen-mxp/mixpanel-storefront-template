import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { LiveActivity } from "@/components/LiveActivity";
import { getPublicConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Northwind — Mixpanel Storefront",
  description:
    "A demo storefront where every click streams an event into Mixpanel. Built with Next.js, Supabase, Vercel, and Stripe via Stripe Projects.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Read provider credentials on the server and pass only the client-safe
  // values down. The Mixpanel token never needs a NEXT_PUBLIC_ rename.
  const config = getPublicConfig();

  return (
    <html lang="en">
      <body>
        <Providers config={config}>
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-24 pt-8">{children}</main>
          <LiveActivity mixpanelEnabled={config.mixpanelToken !== null} />
        </Providers>
      </body>
    </html>
  );
}
