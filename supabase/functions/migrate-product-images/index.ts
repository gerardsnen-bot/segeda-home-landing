import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const allowedHosts = new Set([
  "cdn.quicksell.co",
  "segeda-home-tienda.mad-elynnlevon7.chatgpt.site",
]);
const maxFileBytes = 10 * 1024 * 1024;

function fileExtension(url: string, contentType: string | null) {
  const extension = new URL(url).pathname.match(/\.([a-zA-Z0-9]{2,5})$/)?.[1]?.toLowerCase();
  if (extension) return extension;
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  return "jpg";
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = Deno.env.get("SUPABASE_URL")!;
  const secretKeys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
  const admin = createClient(url, secretKeys.default);
  const body = await request.json().catch(() => ({}));
  const limit = Math.min(Math.max(Number(body.limit) || 20, 1), 30);

  const { data: rows, error } = await admin
    .from("product_images")
    .select("id,image_url")
    .like("image_url", "http%")
    .not("image_url", "ilike", "%supabase.co/storage%")
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const results: Array<{ id: string; status: "migrated" | "skipped" | "failed"; detail?: string }> = [];

  for (const row of rows ?? []) {
    try {
      const source = new URL(row.image_url);
      if (!allowedHosts.has(source.host)) {
        results.push({ id: row.id, status: "skipped", detail: `Host not approved: ${source.host}` });
        continue;
      }

      const response = await fetch(row.image_url, { redirect: "follow" });
      if (!response.ok) throw new Error(`Source returned ${response.status}`);
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.startsWith("image/")) throw new Error(`Unexpected content type: ${contentType}`);

      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength > maxFileBytes) throw new Error("Image exceeds the 10 MB bucket limit");

      const path = `migration/product-images/${row.id}.${fileExtension(row.image_url, contentType)}`;
      const { error: uploadError } = await admin.storage
        .from("mdfantasy-media")
        .upload(path, bytes, { contentType, cacheControl: "31536000", upsert: true });
      if (uploadError) throw uploadError;

      const { data: publicUrl } = admin.storage.from("mdfantasy-media").getPublicUrl(path);
      const { error: updateError } = await admin
        .from("product_images")
        .update({ image_url: publicUrl.publicUrl })
        .eq("id", row.id);
      if (updateError) throw updateError;

      results.push({ id: row.id, status: "migrated" });
    } catch (migrationError) {
      results.push({ id: row.id, status: "failed", detail: migrationError instanceof Error ? migrationError.message : String(migrationError) });
    }
  }

  return Response.json({
    processed: results.length,
    migrated: results.filter((item) => item.status === "migrated").length,
    skipped: results.filter((item) => item.status === "skipped").length,
    failed: results.filter((item) => item.status === "failed").length,
    results,
  });
});
