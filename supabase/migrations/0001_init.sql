-- Northwind storefront — products table.
-- Run this against your Supabase project (provisioned via `stripe projects add
-- supabase/project`). The storefront reads from this table when Supabase is
-- configured; otherwise it serves the bundled catalog in data/products.ts.

create table if not exists public.products (
  id          text primary key,
  slug        text not null unique,
  name        text not null,
  description text not null,
  price       integer not null,
  category    text not null,
  gradient    text not null default 'from-violet-500 to-fuchsia-500',
  emoji       text not null default '🛍️',
  created_at  timestamptz not null default now()
);

-- The storefront uses the publishable (anon) key, so allow public read-only
-- access. Writes are blocked for anon by default (no insert/update policy).
alter table public.products enable row level security;

drop policy if exists "Public read access" on public.products;
create policy "Public read access"
  on public.products
  for select
  to anon, authenticated
  using (true);

-- Seed data — mirrors data/products.ts.
insert into public.products (id, slug, name, description, price, category, gradient, emoji) values
  ('1', 'aurora-headphones', 'Aurora Wireless Headphones', 'Over-ear active noise cancellation with 40-hour battery life and spatial audio. The flagship of the lineup.', 249, 'Audio', 'from-violet-500 to-fuchsia-500', '🎧'),
  ('2', 'pulse-smartwatch', 'Pulse Smartwatch', 'AMOLED always-on display, GPS, and 7-day battery. Tracks workouts, sleep, and heart rate.', 199, 'Wearables', 'from-sky-500 to-indigo-500', '⌚'),
  ('3', 'nomad-backpack', 'Nomad Travel Backpack', '35L weatherproof carry-on with a dedicated laptop sleeve and lay-flat packing. Built for one-bag travel.', 129, 'Gear', 'from-emerald-500 to-teal-500', '🎒'),
  ('4', 'lumen-desk-lamp', 'Lumen Smart Desk Lamp', 'Tunable white and full-color RGB with app control, presence detection, and a built-in wireless charger.', 89, 'Home', 'from-amber-400 to-orange-500', '💡'),
  ('5', 'terra-water-bottle', 'Terra Insulated Bottle', 'Double-wall vacuum steel keeps drinks cold for 24 hours. 750ml with a leak-proof magnetic cap.', 39, 'Gear', 'from-rose-400 to-pink-500', '🧴'),
  ('6', 'echo-mechanical-keyboard', 'Echo Mechanical Keyboard', 'Hot-swappable 75% layout with gasket mount, PBT keycaps, and per-key RGB. Types like a dream.', 159, 'Desk', 'from-slate-600 to-slate-900', '⌨️'),
  ('7', 'drift-sunglasses', 'Drift Polarized Sunglasses', 'Lightweight bio-acetate frames with polarized, scratch-resistant lenses and 100% UV protection.', 79, 'Apparel', 'from-cyan-400 to-blue-500', '🕶️'),
  ('8', 'grove-pour-over', 'Grove Pour-Over Set', 'Borosilicate glass carafe, reusable steel filter, and a precision gooseneck kettle. Café coffee at home.', 64, 'Kitchen', 'from-lime-500 to-emerald-600', '☕')
on conflict (id) do nothing;
