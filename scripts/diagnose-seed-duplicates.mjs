import { readFile } from "node:fs/promises";

const { rows } = JSON.parse(await readFile("/home/ubuntu/segeda-home-catalogo/supabase/catalog-seed-rows.json", "utf8"));
const batch = rows.slice(150, 225);
const groupBy = (values, key) => {
  const grouped = new Map();
  for (const value of values) {
    const itemKey = key(value);
    grouped.set(itemKey, [...(grouped.get(itemKey) ?? []), value]);
  }
  return [...grouped.entries()].filter(([, group]) => group.length > 1).map(([duplicateKey, group]) => ({ duplicateKey, count: group.length, values: group.slice(0, 4) }));
};

const products = groupBy(batch, (product) => product.sku);
const variants = groupBy(batch.flatMap((product) => product.variants.map((variant) => ({ sku: product.sku, label: variant.label, sortOrder: variant.sortOrder }))), (variant) => `${variant.sku}::${variant.label}`);
const tags = groupBy(batch.flatMap((product) => product.tags), (tag) => tag.slug);
console.log(JSON.stringify({ products, variants, tags }, null, 2));
