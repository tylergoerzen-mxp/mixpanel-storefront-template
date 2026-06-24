export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Price in whole US dollars. */
  price: number;
  category: string;
  /** Tailwind gradient classes used for the product tile artwork. */
  gradient: string;
  emoji: string;
};

/**
 * Bundled product catalog. The storefront serves these out of the box so it
 * runs with zero configuration. When Supabase is provisioned, the same shape
 * is loaded from the `products` table instead (see lib/products.ts and
 * supabase/migrations/0001_init.sql).
 */
export const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "aurora-headphones",
    name: "Aurora Wireless Headphones",
    description:
      "Over-ear active noise cancellation with 40-hour battery life and spatial audio. The flagship of the lineup.",
    price: 249,
    category: "Audio",
    gradient: "from-violet-500 to-fuchsia-500",
    emoji: "🎧",
  },
  {
    id: "2",
    slug: "pulse-smartwatch",
    name: "Pulse Smartwatch",
    description:
      "AMOLED always-on display, GPS, and 7-day battery. Tracks workouts, sleep, and heart rate.",
    price: 199,
    category: "Wearables",
    gradient: "from-sky-500 to-indigo-500",
    emoji: "⌚",
  },
  {
    id: "3",
    slug: "nomad-backpack",
    name: "Nomad Travel Backpack",
    description:
      "35L weatherproof carry-on with a dedicated laptop sleeve and lay-flat packing. Built for one-bag travel.",
    price: 129,
    category: "Gear",
    gradient: "from-emerald-500 to-teal-500",
    emoji: "🎒",
  },
  {
    id: "4",
    slug: "lumen-desk-lamp",
    name: "Lumen Smart Desk Lamp",
    description:
      "Tunable white and full-color RGB with app control, presence detection, and a built-in wireless charger.",
    price: 89,
    category: "Home",
    gradient: "from-amber-400 to-orange-500",
    emoji: "💡",
  },
  {
    id: "5",
    slug: "terra-water-bottle",
    name: "Terra Insulated Bottle",
    description:
      "Double-wall vacuum steel keeps drinks cold for 24 hours. 750ml with a leak-proof magnetic cap.",
    price: 39,
    category: "Gear",
    gradient: "from-rose-400 to-pink-500",
    emoji: "🧴",
  },
  {
    id: "6",
    slug: "echo-mechanical-keyboard",
    name: "Echo Mechanical Keyboard",
    description:
      "Hot-swappable 75% layout with gasket mount, PBT keycaps, and per-key RGB. Types like a dream.",
    price: 159,
    category: "Desk",
    gradient: "from-slate-600 to-slate-900",
    emoji: "⌨️",
  },
  {
    id: "7",
    slug: "drift-sunglasses",
    name: "Drift Polarized Sunglasses",
    description:
      "Lightweight bio-acetate frames with polarized, scratch-resistant lenses and 100% UV protection.",
    price: 79,
    category: "Apparel",
    gradient: "from-cyan-400 to-blue-500",
    emoji: "🕶️",
  },
  {
    id: "8",
    slug: "grove-pour-over",
    name: "Grove Pour-Over Set",
    description:
      "Borosilicate glass carafe, reusable steel filter, and a precision gooseneck kettle. Café coffee at home.",
    price: 64,
    category: "Kitchen",
    gradient: "from-lime-500 to-emerald-600",
    emoji: "☕",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug);
}
