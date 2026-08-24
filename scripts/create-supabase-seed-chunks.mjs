import { mkdir, readFile, writeFile } from "node:fs/promises";

const projectId = "vrusfoxihkjywmvdveoy";
const data = JSON.parse(await readFile("/home/ubuntu/segeda-home-catalogo/supabase/catalog-seed-rows.json", "utf8"));
const outputDir = "/home/ubuntu/segeda-home-catalogo/supabase/seed-chunks";
const chunkSize = 75;

const json = (value) => JSON.stringify(value).replaceAll("$json$", "$json_escaped$");
const wrap = (name, query) => JSON.stringify({ project_id: projectId, query });

await mkdir(outputDir, { recursive: true });

const categoryQuery = `
with seed as (
  select * from jsonb_to_recordset($json$${json(data.categoryMeta)}$json$::jsonb)
  as x(slug text, name text, icon text, "imageUrl" text, "sortOrder" integer)
)
insert into public.categories (name, slug, icon, image_url, active, sort_order)
select name, slug, icon, "imageUrl", true, "sortOrder" from seed
on conflict (slug) do update set name = excluded.name, icon = excluded.icon, image_url = excluded.image_url, active = true, sort_order = excluded.sort_order, deleted_at = null;
`;
await writeFile(`${outputDir}/000_categories.json`, wrap("categories", categoryQuery));

for (let start = 0; start < data.rows.length; start += chunkSize) {
  const chunk = data.rows.slice(start, start + chunkSize);
  const payload = json(chunk);
  const number = String(Math.floor(start / chunkSize) + 1).padStart(3, "0");
  const query = `
with raw_seed as (
  select * from jsonb_to_recordset($json$${payload}$json$::jsonb)
  as x(sku text, name text, slug text, "shortDescription" text, description text, "categorySlug" text, audience text, "themeGroup" text, "estimatedDays" text, featured boolean, "sortOrder" integer, status text, variants jsonb, "galleryUrls" jsonb, tags jsonb)
), seed as (
  select distinct on (sku) * from raw_seed order by sku, "sortOrder"
), imported_products as (
  insert into public.products (sku, name, slug, short_description, description, category_id, audience, theme_group, estimated_days, status, featured, sort_order, deleted_at)
  select seed.sku, seed.name, seed.slug, seed."shortDescription", seed.description, category.id, seed.audience, seed."themeGroup", seed."estimatedDays", seed.status::public.product_status, seed.featured, seed."sortOrder", null
  from seed join public.categories category on category.slug = seed."categorySlug"
  on conflict (sku) do update set name = excluded.name, slug = excluded.slug, short_description = excluded.short_description, description = excluded.description, category_id = excluded.category_id, audience = excluded.audience, theme_group = excluded.theme_group, estimated_days = excluded.estimated_days, status = excluded.status, featured = excluded.featured, sort_order = excluded.sort_order, deleted_at = null
  returning id, sku
), inserted_variants as (
  insert into public.product_variants (product_id, label, price, compare_at_price, active, sort_order)
  select distinct on (product.id, variant.label) product.id, variant.label, variant.price::numeric, nullif(variant."compareAtPrice"::numeric, 0), true, variant."sortOrder"
  from seed join public.products product on product.sku = seed.sku
  cross join lateral jsonb_to_recordset(seed.variants) as variant(label text, price numeric, "compareAtPrice" numeric, "sortOrder" integer)
  order by product.id, variant.label, variant."sortOrder"
  on conflict (product_id, label) do update set price = excluded.price, compare_at_price = excluded.compare_at_price, active = true, sort_order = excluded.sort_order
  returning id
), deleted_images as (
  delete from public.product_images image using public.products product
  where image.product_id = product.id and product.sku in (select sku from seed)
  returning image.id
), inserted_images as (
  insert into public.product_images (product_id, image_url, alt_text, is_primary, sort_order)
  select product.id, image.value, seed.name, image.ordinality = 1, image.ordinality - 1
  from seed join public.products product on product.sku = seed.sku
  cross join lateral jsonb_array_elements_text(seed."galleryUrls") with ordinality as image(value, ordinality)
  returning id
), tag_seed as (
  select distinct on (tag.slug) tag.name, tag.slug
  from seed cross join lateral jsonb_to_recordset(seed.tags) as tag(name text, slug text)
  order by tag.slug, tag.name
), inserted_tags as (
  insert into public.tags (name, slug)
  select name, slug from tag_seed where slug <> ''
  on conflict (slug) do update set name = excluded.name
  returning id
)
insert into public.product_tags (product_id, tag_id)
select product.id, tag.id
from seed join public.products product on product.sku = seed.sku
cross join lateral jsonb_to_recordset(seed.tags) as tag_item(name text, slug text)
join public.tags tag on tag.slug = tag_item.slug
on conflict do nothing;
`;
  await writeFile(`${outputDir}/${number}_products.json`, wrap(`products_${number}`, query));
}

const sectionsQuery = `
insert into public.site_sections (section_key, internal_name, title, description, image_url, cta_label, cta_url, active, sort_order, payload)
values
  ('home-hero', 'Hero principal', 'Un detalle único para cada espacio.', 'Descubre decoración infantil, hogar, didácticos, alcancías, regalos y colecciones de temporada.', '/manus-storage/nubes-portada-premium_f843e2ec.jpeg', 'Explorar colecciones', '/catalogo', true, 0, '{"section":"hero"}'::jsonb),
  ('faith-banner', 'Banner de fe y espiritualidad', 'Fe y espiritualidad', 'Piezas que inspiran y dan significado a cada espacio.', '/manus-storage/fe-espiritualidad_546155f2.png', 'Ver colección', '/catalogo/fe-espiritualidad', true, 1, '{"section":"feature"}'::jsonb)
on conflict (section_key) do update set internal_name = excluded.internal_name, title = excluded.title, description = excluded.description, image_url = excluded.image_url, cta_label = excluded.cta_label, cta_url = excluded.cta_url, active = true, sort_order = excluded.sort_order, payload = excluded.payload;
`;
await writeFile(`${outputDir}/999_sections.json`, wrap("sections", sectionsQuery));
