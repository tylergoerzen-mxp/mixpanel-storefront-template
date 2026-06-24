"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";
import { CartProvider } from "@/lib/cart";
import type { PublicConfig } from "@/lib/config";

/**
 * Client-side root providers. Receives the public config from the server layout
 * (so we can use the exact env var names Stripe Projects injects) and boots the
 * Mixpanel SDK once on mount.
 */
export function Providers({
  config,
  children,
}: {
  config: PublicConfig;
  children: React.ReactNode;
}) {
  useEffect(() => {
    initAnalytics(config.mixpanelToken, config.mixpanelApiHost);
  }, [config.mixpanelToken, config.mixpanelApiHost]);

  return <CartProvider>{children}</CartProvider>;
}
