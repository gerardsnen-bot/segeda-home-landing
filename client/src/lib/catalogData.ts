import { supabase } from "@/lib/supabase";

export type CatalogSize = { label: string; price: number };
export type CatalogProduct = {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number;
  sizes: CatalogSize[];
  tags: string;
  audience: string;
  genderTarget: "girl" | "boy" | "unisex";
  genderReviewStatus: "classified" | "pending_review" | "mix";
  themeGroup: string;
  estimatedDays: string;
  featured: boolean;
  imageUrl: string;
  galleryUrls: string[];
};

export type ManagedCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  icon: string;
  sortOrder: number;
  productCount: number;
};

export type ManagedSection = {
  id: string;
  key: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
  payload: Record<string, unknown>;
};

export type PublicSeo = { title: string; description: string; keywords: string; image: string };

type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  audience: string | null;
  gender_target: "girl" | "boy" | "unisex" | null;
  gender_review_status: "classified" | "pending_review" | "mix" | null;
  theme_group: string | null;
  estimated_days: string | null;
  featured: boolean;
  product_variants: { label: string; price: number | string; compare_at_price: number | string | null; sort_order: number }[];
  product_images: { image_url: string; sort_order: number }[];
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  icon: string | null;
  sort_order: number;
};


export function genderTargetToAudience(target: "girl" | "boy" | "unisex" | null, fallback: string | null): string {
  if (target === "girl") return "niña";
  if (target === "boy") return "niño";
  if (target === "unisex") return "unisex";
  return fallback ?? "unisex";
}

export type CatalogAudienceFilter = "todos" | "niña" | "niño" | "mix";

export function hasCatalogPrice(price: number): boolean {
  return Number.isFinite(price) && price > 0;
}

export function matchesCatalogAudience(product: CatalogProduct, filter: CatalogAudienceFilter): boolean {
  if (filter === "todos") return true;
  if (filter === "mix") return product.genderReviewStatus === "mix" || product.genderReviewStatus === "pending_review";
  return product.audience === filter;
}

function mapProduct(row: ProductRow): CatalogProduct {
  const variants = [...(row.product_variants ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const images = [...(row.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order).map((image) => image.image_url);
  const firstVariant = variants[0];
  return {
    id: row.id,
    title: row.name,
    description: row.description ?? row.short_description ?? "",
    price: Number(firstVariant?.price ?? 0),
    compareAtPrice: Number(firstVariant?.compare_at_price ?? 0),
    sizes: variants.map((variant) => ({ label: variant.label, price: Number(variant.price) })),
    tags: "",
    audience: genderTargetToAudience(row.gender_target, row.audience),
    genderTarget: row.gender_target ?? "unisex",
    genderReviewStatus: row.gender_review_status ?? "pending_review",
    themeGroup: row.theme_group ?? "",
    estimatedDays: row.estimated_days ?? "",
    featured: row.featured,
    imageUrl: images[0] ?? "",
    galleryUrls: images,
  };
}

export async function getCatalogCategory(slug: string): Promise<CatalogProduct[]> {
  if (!supabase) return [];

  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (categoryError || !category?.id) return [];

  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,short_description,audience,gender_target,gender_review_status,theme_group,estimated_days,featured,product_variants(label,price,compare_at_price,sort_order),product_images(image_url,sort_order)")
    .eq("status", "active")
    .eq("category_id", category.id)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return [];
  return (data as unknown as ProductRow[]).map(mapProduct);
}

export async function getCatalogOverview(): Promise<ManagedCategory[]> {
  if (!supabase) return [];

  const [{ data: categories, error: categoriesError }, { data: products, error: productsError }] = await Promise.all([
    supabase.from("categories").select("id,name,slug,image_url,icon,sort_order").eq("active", true).is("deleted_at", null).order("sort_order", { ascending: true }),
    supabase.from("products").select("category_id").eq("status", "active").is("deleted_at", null),
  ]);

  if (categoriesError || productsError || !categories?.length) return [];
  const counts = new Map<string, number>();
  for (const product of products ?? []) {
    if (product.category_id) counts.set(product.category_id, (counts.get(product.category_id) ?? 0) + 1);
  }
  return (categories as CategoryRow[]).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    imageUrl: category.image_url ?? "",
    icon: category.icon ?? "✦",
    sortOrder: category.sort_order,
    productCount: counts.get(category.id) ?? 0,
  }));
}

export async function getPublicSections(): Promise<ManagedSection[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("site_sections")
    .select("id,section_key,title,subtitle,description,image_url,cta_label,cta_url,payload")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error || !data?.length) return [];
  return data.map((section) => ({
    id: section.id,
    key: section.section_key,
    title: section.title ?? "",
    subtitle: section.subtitle ?? "",
    description: section.description ?? "",
    imageUrl: section.image_url ?? "",
    ctaLabel: section.cta_label ?? "",
    ctaUrl: section.cta_url ?? "",
    payload: (section.payload as Record<string, unknown> | null) ?? {},
  }));
}

export async function getPublicSeo(): Promise<PublicSeo | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("site_settings").select("seo_defaults").eq("singleton", true).maybeSingle();
  if (error || !data?.seo_defaults || typeof data.seo_defaults !== "object") return null;
  const seo = data.seo_defaults as Partial<PublicSeo>;
  return {
    title: seo.title ?? "",
    description: seo.description ?? "",
    keywords: seo.keywords ?? "",
    image: seo.image ?? "",
  };
}
