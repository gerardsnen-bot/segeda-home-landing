import { mkdir, readFile, writeFile } from "node:fs/promises";

const projectId = "vrusfoxihkjywmvdveoy";
const { rows } = JSON.parse(await readFile("/home/ubuntu/segeda-home-catalogo/supabase/catalog-seed-rows.json", "utf8"));
const outputDir = "/home/ubuntu/segeda-home-catalogo/supabase/image-backfill-chunks";
const chunkSize = 60;

await mkdir(outputDir, { recursive: true });
for (let start = 0; start < rows.length; start += chunkSize) {
  const chunk = rows.slice(start, start + chunkSize).map(({ sku, name, galleryUrls }) => ({ sku, name, galleryUrls }));
  const payload = JSON.stringify(chunk);
  const number = String(Math.floor(start / chunkSize) + 1).padStart(3, "0");
  const sql = `
with seed as (
  select * from jsonb_to_recordset($json$${payload}$json$::jsonb)
  as x(sku text, name text, "galleryUrls" jsonb)
)
delete from public.product_images image
using public.products product, seed
where image.product_id = product.id and product.sku = seed.sku;

with seed as (
  select * from jsonb_to_recordset($json$${payload}$json$::jsonb)
  as x(sku text, name text, "galleryUrls" jsonb)
), images as (
  select distinct on (product.id, item.value) product.id as product_id, item.value as image_url, seed.name as alt_text, item.ordinality = 1 as is_primary, item.ordinality - 1 as sort_order
  from seed
  join public.products product on product.sku = seed.sku
  cross join lateral jsonb_array_elements_text(seed."galleryUrls") with ordinality as item(value, ordinality)
  order by product.id, item.value, item.ordinality
)
insert into public.product_images (product_id, image_url, alt_text, is_primary, sort_order)
select product_id, image_url, alt_text, is_primary, sort_order from images;
`;
  await writeFile(`${outputDir}/${number}_images.json`, JSON.stringify({ project_id: projectId, query: sql }));
}
