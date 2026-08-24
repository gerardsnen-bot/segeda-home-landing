import { readFile, writeFile } from "node:fs/promises";

const sourceRoot = "/home/ubuntu/segeda-reference-data";
const source = "https://segeda-home-tienda.mad-elynnlevon7.chatgpt.site";
const productFiles = [
  ["nubes", "nubes"], ["placas", "placas"], ["cuadros", "cuadros"], ["combo220", "combo"],
  ["nube-cuadros", "nube-cuadros"], ["nube-cuadros-lampara", "nube-cuadros-lampara"],
  ["nombre-cuadros", "nombre-cuadros"], ["packs", "packs"], ["lamparas", "lamparas"],
  ["liquidacion", "liquidacion"], ["fe-espiritualidad", "fe-espiritualidad"], ["alcancias", "alcancias"], ["didacticos", "didacticos"],
];

const categoryMeta = [
  ["navidad", "Preventa Navideña", "✼", "/manus-storage/navidad_c98eafac.jpg", 0],
  ["nubes", "Nubes temáticas", "☁", "/manus-storage/nubes-portada-premium_f843e2ec.jpeg", 1],
  ["placas", "Placas circulares", "○", "/manus-storage/placas_f2df896b.jpg", 2],
  ["cuadros", "Cuadros infantiles", "▣", "/manus-storage/cuadros_0fdc2e1c.jpg", 3],
  ["combo", "Combo completo", "✦", "/manus-storage/combo_d729a5a2.jpg", 4],
  ["nube-cuadros", "Nube + cuadros", "☁", "/manus-storage/nube-cuadros_4f013700.jpg", 5],
  ["nube-cuadros-lampara", "Nube + cuadros + lámpara", "☼", "/manus-storage/combo_d729a5a2.jpg", 6],
  ["nombre-cuadros", "Nombre + cuadros", "Aa", "/manus-storage/nube-cuadros_4f013700.jpg", 7],
  ["packs", "Packs lamparitas", "✧", "/manus-storage/instalacion-real-nubes_eee88aa5.jpg", 8],
  ["lamparas", "Lámparas decorativas", "☼", "/manus-storage/instalacion-real-nubes_eee88aa5.jpg", 9],
  ["liquidacion", "Liquidación", "%", "/manus-storage/cuadros_0fdc2e1c.jpg", 10],
  ["fe-espiritualidad", "Fe y espiritualidad", "✦", "/manus-storage/fe-espiritualidad_546155f2.png", 11],
  ["alcancias", "Alcancías y regalos", "♡", "/manus-storage/placas_f2df896b.jpg", 12],
  ["didacticos", "Didácticos", "ABC", "/manus-storage/cuadros_0fdc2e1c.jpg", 13],
].map(([slug, name, icon, imageUrl, sortOrder]) => ({ slug, name, icon, imageUrl, sortOrder }));

const url = (value) => value?.startsWith("http") ? value : `${source}${value}`;
const slugify = (value) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 180);
const rows = [];

for (const [file, categorySlug] of productFiles) {
  const raw = JSON.parse(await readFile(`${sourceRoot}/${file}.json`, "utf8"));
  raw.products.forEach((product, index) => {
    const imageUrl = url(product.imageUrl);
    const galleryUrls = [...new Set([imageUrl, ...(product.galleryUrls || []).map(url)].filter(Boolean))];
    const variants = product.sizes?.length ? product.sizes.map((size, sizeIndex) => ({
      label: size.label,
      price: Number(size.price),
      compareAtPrice: Number(product.compareAtPrice || 0) || null,
      sortOrder: sizeIndex,
    })) : [{ label: "Personalizado", price: Number(product.price), compareAtPrice: Number(product.compareAtPrice || 0) || null, sortOrder: 0 }];
    const tags = String(product.tags || "").split(/[,|]/).map((tag) => tag.trim()).filter(Boolean).map((tag) => ({ name: tag, slug: slugify(tag) }));
    rows.push({
      sku: `LEGACY-${categorySlug}-${product.id}`,
      name: product.title,
      slug: `${categorySlug}-${slugify(product.title)}-${product.id}`,
      shortDescription: product.description || "",
      description: product.description || "",
      categorySlug,
      audience: product.audience || null,
      themeGroup: product.themeGroup || null,
      estimatedDays: product.estimatedDays || null,
      featured: Boolean(product.featured),
      sortOrder: index,
      status: "active",
      variants,
      galleryUrls,
      tags,
    });
  });
}

for (let index = 1; index <= 9; index += 1) {
  const imageUrl = `${source}/navidad-preventa/modelo-${index}.webp`;
  rows.push({
    sku: `LEGACY-navidad-${index}`,
    name: `Modelo ${index}`,
    slug: `navidad-modelo-${index}`,
    shortDescription: "Preventa navideña personalizable.",
    description: "Letrero navideño personalizado disponible en preventa.",
    categorySlug: "navidad",
    audience: null,
    themeGroup: "navidad",
    estimatedDays: "5 a 7 días",
    featured: index === 1,
    sortOrder: index - 1,
    status: "active",
    variants: [{ label: "Letrero personalizado", price: 79, compareAtPrice: 109, sortOrder: 0 }],
    galleryUrls: [imageUrl],
    tags: [{ name: "Preventa navideña", slug: "preventa-navidena" }],
  });
}

const data = JSON.stringify(rows);
const categories = JSON.stringify(categoryMeta);
const sql = `
with category_seed as (
  select * from jsonb_to_recordset($category_seed$${categories}$category_seed$::jsonb)
  as x(slug text, name text, icon text, "imageUrl" text, "sortOrder" integer)
)
insert into public.categories (name, slug, icon, image_url, active, sort_order)
select name, slug, icon, "imageUrl", true, "sortOrder" from category_seed
on conflict (slug) do update set
  name = excluded.name,
  icon = excluded.icon,
  image_url = excluded.image_url,
  sort_order = excluded.sort_order,
  active = true,
  deleted_at = null;

with product_seed as (
  select * from jsonb_to_recordset($product_seed$${data}$product_seed$::jsonb)
  as x(
    sku text, name text, slug text, "shortDescription" text, description text,
    "categorySlug" text, audience text, "themeGroup" text, "estimatedDays" text,
    featured boolean, "sortOrder" integer, status text, variants jsonb, "galleryUrls" jsonb, tags jsonb
  )
)
insert into public.products (
  sku, name, slug, short_description, description, category_id, audience, theme_group,
  estimated_days, status, featured, sort_order, deleted_at
)
select p.sku, p.name, p.slug, p."shortDescription", p.description, c.id, p.audience,
  p."themeGroup", p."estimatedDays", p.status::public.product_status, p.featured, p."sortOrder", null
from product_seed p
join public.categories c on c.slug = p."categorySlug"
on conflict (sku) do update set
  name = excluded.name,
  slug = excluded.slug,
  short_description = excluded.short_description,
  description = excluded.description,
  category_id = excluded.category_id,
  audience = excluded.audience,
  theme_group = excluded.theme_group,
  estimated_days = excluded.estimated_days,
  status = excluded.status,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  deleted_at = null;

with product_seed as (
  select * from jsonb_to_recordset($product_seed$${data}$product_seed$::jsonb)
  as x(sku text, variants jsonb)
)
insert into public.product_variants (product_id, label, price, compare_at_price, active, sort_order)
select p.id, v.label, v.price::numeric, nullif(v."compareAtPrice"::numeric, 0), true, v."sortOrder"
from product_seed seed
join public.products p on p.sku = seed.sku
cross join lateral jsonb_to_recordset(seed.variants) as v(label text, price numeric, "compareAtPrice" numeric, "sortOrder" integer)
on conflict (product_id, label) do update set
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  active = true,
  sort_order = excluded.sort_order;

delete from public.product_images image
using public.products p
where image.product_id = p.id and p.sku like 'LEGACY-%';

with product_seed as (
  select * from jsonb_to_recordset($product_seed$${data}$product_seed$::jsonb)
  as x(sku text, name text, "galleryUrls" jsonb)
)
insert into public.product_images (product_id, image_url, alt_text, is_primary, sort_order)
select p.id, item.value, seed.name, item.ordinality = 1, item.ordinality - 1
from product_seed seed
join public.products p on p.sku = seed.sku
cross join lateral jsonb_array_elements_text(seed."galleryUrls") with ordinality as item(value, ordinality);

with all_tags as (
  select distinct tag.name, tag.slug
  from jsonb_to_recordset($product_seed$${data}$product_seed$::jsonb) as x(tags jsonb)
  cross join lateral jsonb_to_recordset(x.tags) as tag(name text, slug text)
)
insert into public.tags (name, slug)
select name, slug from all_tags
where slug <> ''
on conflict (slug) do update set name = excluded.name;

with product_seed as (
  select * from jsonb_to_recordset($product_seed$${data}$product_seed$::jsonb)
  as x(sku text, tags jsonb)
)
insert into public.product_tags (product_id, tag_id)
select p.id, t.id
from product_seed seed
join public.products p on p.sku = seed.sku
cross join lateral jsonb_to_recordset(seed.tags) as tag_item(name text, slug text)
join public.tags t on t.slug = tag_item.slug
on conflict do nothing;

insert into public.site_sections (section_key, internal_name, title, description, image_url, cta_label, cta_url, active, sort_order, payload)
values
  ('home-hero', 'Hero principal', 'Un detalle único para cada espacio.', 'Descubre decoración infantil, hogar, didácticos, alcancías, regalos y colecciones de temporada.', '/manus-storage/nubes-portada-premium_f843e2ec.jpeg', 'Explorar colecciones', '/catalogo', true, 0, '{"section":"hero"}'::jsonb),
  ('faith-banner', 'Banner de fe y espiritualidad', 'Fe y espiritualidad', 'Piezas que inspiran y dan significado a cada espacio.', '/manus-storage/fe-espiritualidad_546155f2.png', 'Ver colección', '/catalogo/fe-espiritualidad', true, 1, '{"section":"feature"}'::jsonb)
on conflict (section_key) do update set
  internal_name = excluded.internal_name,
  title = excluded.title,
  description = excluded.description,
  image_url = excluded.image_url,
  cta_label = excluded.cta_label,
  cta_url = excluded.cta_url,
  active = true,
  sort_order = excluded.sort_order,
  payload = excluded.payload;
`;

await writeFile("/home/ubuntu/segeda-home-catalogo/supabase/seed-summary.json", JSON.stringify({ categories: categoryMeta.length, products: rows.length }, null, 2));
await writeFile("/home/ubuntu/segeda-home-catalogo/supabase/catalog-seed-rows.json", JSON.stringify({ categoryMeta, rows }));
await writeFile("/home/ubuntu/segeda-home-catalogo/supabase/migrations/0002_mdfantasy_catalog_seed.input.json", JSON.stringify({
  project_id: "vrusfoxihkjywmvdveoy",
  query: sql,
}));
