import { readFile, writeFile } from "node:fs/promises";

const query = await readFile("/home/ubuntu/segeda-home-catalogo/supabase/migrations/0001_mdfantasy_core.sql", "utf8");
await writeFile(
  "/home/ubuntu/segeda-home-catalogo/supabase/migrations/0001_mdfantasy_core.input.json",
  JSON.stringify({
    project_id: "vrusfoxihkjywmvdveoy",
    name: "mdfantasy_core_schema",
    query,
  }),
);
