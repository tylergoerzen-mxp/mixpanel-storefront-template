# Mixpanel Storefront

A one-click-deploy **Next.js storefront** where every interaction streams an event into your **Mixpanel** project. Built to be scaffolded with [`stripe projects build`](https://docs.stripe.com/projects) — provisioning Mixpanel, Supabase, and Vercel for you automatically.

Browse products, add to cart, and check out. Each click fires a tracked event (`Product Viewed`, `Product Added to Cart`, `Checkout Started`, `Order Completed`) that shows up in the on-screen **Live events** panel and, side-by-side, in Mixpanel's Events view.

```
stripe projects build   # pick "Mixpanel Storefront", then:
pnpm install
pnpm dev                 # → http://localhost:3000
```

That's it. The app runs with **zero configuration** — it ships with a bundled product catalog and a demo checkout, so it works the moment it starts. Provision the services below to light up live analytics, a real database, and real payments.

---

## What it shows off

- **Mixpanel event streaming.** A clean storefront funnel (`Product List Viewed → Product Viewed → Product Added to Cart → Checkout Started → Order Completed`) plus Mixpanel **autocapture** for clicks and pageviews. Open Mixpanel's Events view next to the app and watch events land in real time.
- **A live activity panel** in the corner that mirrors every tracked event the instant it fires — the fastest way to see "I clicked, it tracked."
- **A real conversion funnel** you can build a report on in Mixpanel within a minute of deploying.
- **User identification** — drop in an email at checkout and the session is tied to a Mixpanel user profile via `identify()`.

## Stack

| Service | Provider | Role |
|---------|----------|------|
| **Mixpanel** | `mixpanel/analytics` | Product analytics + autocapture (the star) |
| **Supabase** | `supabase/project` | Optional Postgres product catalog |
| **Vercel** | `vercel/project` | One-click hosting / `pnpm deploy` |
| **Stripe Checkout** | _(optional, your keys)_ | Real payments; demo mode otherwise |

All three Projects services run on **free tiers**.

---

## Setup

### 1. Scaffold and run

```bash
stripe projects build        # select "Mixpanel Storefront"
pnpm install
pnpm dev
```

If you provisioned Mixpanel during the build, your `MIXPANEL_PROJECT_TOKEN` is already injected — events stream immediately. If not, the app still runs (the live panel shows `local only`); add Mixpanel any time:

```bash
stripe projects add mixpanel/analytics
stripe projects env --pull    # writes the token into .env
```

### 2. (Optional) Use Supabase for the catalog

The storefront serves a bundled catalog by default. To read products from Postgres instead:

```bash
stripe projects add supabase/project
stripe projects env --pull
```

Then apply the schema in `supabase/migrations/0001_init.sql` — paste it into the **Supabase SQL editor**, or run it with `psql "$SUPABASE_DB_URL" -f supabase/migrations/0001_init.sql`. With `SUPABASE_PROJECT_URL` and `SUPABASE_PUBLISHABLE_KEY` set, the home page loads products from the `products` table; if anything is missing it falls back to the bundled catalog.

### 3. (Optional) Enable real Stripe Checkout

Without Stripe keys, checkout runs in **demo mode** (no charge, still fires `Order Completed`). To take real test payments, add your [Stripe test keys](https://dashboard.stripe.com/test/apikeys) to `.env`:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. Deploy

```bash
stripe projects add vercel/project   # if not already provisioned
pnpm deploy                          # vercel deploy --prod
```

---

## Environment variables

Everything the storefront needs is injected by Stripe Projects — see [`.env.example`](./.env.example) for the full list. Only `MIXPANEL_PROJECT_TOKEN` is needed to start streaming events, and `stripe projects build` provides it. The Stripe Checkout keys are the only variables you set by hand, and they're optional.

## How the wiring works

- **`lib/config.ts`** reads provider credentials on the server using the exact variable names Stripe Projects emits (e.g. `MIXPANEL_PROJECT_TOKEN`, `SUPABASE_PROJECT_URL`) — no manual `NEXT_PUBLIC_` renaming required — and passes only client-safe values to the browser.
- **`lib/analytics.ts`** initializes the Mixpanel browser SDK (with autocapture) and exposes a typed event catalog plus a tiny subscriber the live panel listens to.
- **`lib/cart.tsx`** is a localStorage-backed cart that fires add/remove events as the single source of truth.
- **`lib/products.ts`** reads from Supabase when configured and falls back to `data/products.ts` otherwise.

## Project structure

```
app/                  Next.js App Router pages (home, product, cart, checkout)
  api/checkout/       Stripe Checkout session (demo fallback)
components/           UI + the LiveActivity event panel
lib/                  analytics, cart, config, products
data/products.ts      bundled catalog (runs with zero config)
supabase/migrations/  products table schema + seed
```

## License

MIT — see [LICENSE](./LICENSE).
