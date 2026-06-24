/**
 * Reads runtime configuration from environment variables on the server.
 *
 * Stripe Projects injects provider credentials WITHOUT the `NEXT_PUBLIC_`
 * prefix (e.g. `MIXPANEL_PROJECT_TOKEN`), so we read them here in server
 * components and hand only the safe, client-needed values down to the browser
 * via props. That keeps the template working with the exact variable names the
 * providers emit — no manual renaming required.
 */

export type PublicConfig = {
  /** Mixpanel project token used to initialize the browser SDK. */
  mixpanelToken: string | null;
  /** Mixpanel ingestion host (region-aware), passed as the SDK `api_host`. */
  mixpanelApiHost: string | null;
  /** Supabase project URL — present only when Supabase is provisioned. */
  supabaseUrl: string | null;
  /** Supabase publishable (anon) key. */
  supabaseKey: string | null;
  /** Whether real Stripe Checkout is configured (secret key present). */
  stripeEnabled: boolean;
};

/** Normalize empty strings (a common Projects placeholder) to null. */
function clean(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getPublicConfig(): PublicConfig {
  return {
    mixpanelToken: clean(process.env.MIXPANEL_PROJECT_TOKEN),
    mixpanelApiHost: clean(process.env.MIXPANEL_INGESTION_URL),
    supabaseUrl: clean(process.env.SUPABASE_PROJECT_URL),
    supabaseKey: clean(process.env.SUPABASE_PUBLISHABLE_KEY),
    stripeEnabled: clean(process.env.STRIPE_SECRET_KEY) !== null,
  };
}

/** Best-effort absolute site URL for building redirect links. */
export function getSiteUrl(): string {
  const explicit = clean(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = clean(process.env.VERCEL_PROJECT_URL) || clean(process.env.VERCEL_URL);
  if (vercel) return vercel.startsWith("http") ? vercel : `https://${vercel}`;
  return "http://localhost:3000";
}
