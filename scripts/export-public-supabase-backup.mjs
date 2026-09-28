import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error("VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are required.");

const tables = ["categories", "products", "product_variants", "product_images", "site_sections", "site_settings"];
const orderColumn = { site_settings: "singleton" };
const destination = path.join("supabase", "backups", `public-catalog-${new Date().toISOString().slice(0, 10)}.json`);

async function readAll(table) {
  const pageSize = 1000;
  const rows = [];
  for (let offset = 0; ; offset += pageSize) {
    const response = await fetch(`${url}/rest/v1/${table}?select=*&order=${orderColumn[table] ?? "id"}.asc`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Range: `${offset}-${offset + pageSize - 1}`,
      },
    });
    if (!response.ok) throw new Error(`${table}: ${response.status} ${await response.text()}`);
    const page = await response.json();
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }
}

const data = {};
for (const table of tables) data[table] = await readAll(table);
const exportedAt = new Date().toISOString();
const payload = { exportedAt, projectUrl: url, tables: data };
const serialised = `${JSON.stringify(payload, null, 2)}\n`;
await fs.mkdir(path.dirname(destination), { recursive: true });
await fs.writeFile(destination, serialised, "utf8");
const hash = crypto.createHash("sha256").update(serialised).digest("hex");
await fs.writeFile(`${destination}.sha256`, `${hash}  ${path.basename(destination)}\n`, "utf8");
console.log(JSON.stringify({ destination, sha256: hash, counts: Object.fromEntries(tables.map((table) => [table, data[table].length])) }, null, 2));
