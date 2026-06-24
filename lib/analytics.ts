"use client";

import mixpanel from "mixpanel-browser";

/**
 * Central event taxonomy for the storefront funnel. Keeping the names in one
 * place means every component fires consistent events — exactly what you want
 * when you open Mixpanel and build a funnel report.
 */
export const EVENTS = {
  PRODUCT_LIST_VIEWED: "Product List Viewed",
  PRODUCT_VIEWED: "Product Viewed",
  PRODUCT_ADDED: "Product Added to Cart",
  PRODUCT_REMOVED: "Product Removed from Cart",
  CART_VIEWED: "Cart Viewed",
  CHECKOUT_STARTED: "Checkout Started",
  ORDER_COMPLETED: "Order Completed",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

/** A record of a tracked event, surfaced to the on-screen live activity feed. */
export type TrackedEvent = {
  id: string;
  name: string;
  props: Record<string, unknown>;
  at: number;
};

type Listener = (event: TrackedEvent) => void;

const listeners = new Set<Listener>();
let initialized = false;
let enabled = false;
let counter = 0;

/**
 * Initialize the Mixpanel browser SDK. Safe to call more than once and safe to
 * call with a null token — without a token the storefront still runs and the
 * live activity feed still works, the events just aren't shipped to Mixpanel.
 */
export function initAnalytics(token: string | null, apiHost?: string | null): boolean {
  if (initialized || typeof window === "undefined") return enabled;
  initialized = true;

  if (!token) {
    console.info(
      "[analytics] No Mixpanel token found. Running in local-only mode — " +
        "provision mixpanel/analytics via `stripe projects add mixpanel/analytics` " +
        "to stream events.",
    );
    return false;
  }

  mixpanel.init(token, {
    // Autocapture clicks/inputs/submits so even un-instrumented UI shows up in
    // the stream — the "click around and watch events appear" magic. Pageviews
    // are handled by track_pageview below instead, so we disable autocapture's
    // pageview to avoid double-counting. The explicit funnel events the app
    // fires (Product Viewed, Added to Cart, …) sit on top of this.
    autocapture: { pageview: false, click: true, input: true, submit: true, scroll: true },
    track_pageview: "url-with-path",
    persistence: "localStorage",
    ...(apiHost ? { api_host: apiHost } : {}),
  });
  enabled = true;
  return true;
}

/** Track an event to Mixpanel (if enabled) and to the live activity feed. */
export function track(name: string, props: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  if (enabled) {
    mixpanel.track(name, props);
  }
  const event: TrackedEvent = {
    id: `${Date.now()}-${counter++}`,
    name,
    props,
    at: Date.now(),
  };
  listeners.forEach((listener) => listener(event));
}

/** Associate the current browser with a known user (called at checkout). */
export function identifyUser(distinctId: string, traits: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || !enabled) return;
  mixpanel.identify(distinctId);
  if (Object.keys(traits).length > 0) {
    mixpanel.people.set(traits);
  }
}

/** Subscribe to tracked events for the live activity feed. Returns an unsubscribe. */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Whether events are actually being shipped to Mixpanel. */
export function isEnabled(): boolean {
  return enabled;
}
