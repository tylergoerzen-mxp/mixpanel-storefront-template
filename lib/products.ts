import { createClient } from "@supabase/supabase-js";
import { PRODUCTS, type Product, getProductBySlug as getSeedBySlug } from "@/data/products";
import { getPublicConfig } from "@/lib/config";

/**
 * Returns the product catalog. If Supabase is provisioned (and a `products`
 * table exists), the catalog is read from there; otherwise it falls back to the
 * bundled seed so the storefront always renders. Any Supabase error degrades
 * gracefully to the seed rather than crashing the page.
 */
export async function getProducts(): Promise<Product[]> {
  const { supabaseUrl, supabaseKey } = getPublicConfig();
  if (!supabaseUrl || !supabaseKey) return PRODUCTS;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("products")
      .select("id, slug, name, description, price, category, gradient, emoji")
      .order("price", { ascending: true });

    if (error || !data || data.length === 0) return PRODUCTS;
    return data as Product[];
  } catch {
    return PRODUCTS;
  }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? getSeedBySlug(slug);
}
