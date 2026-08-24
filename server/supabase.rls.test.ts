import { describe, expect, it } from "vitest";

type SiteSetting = { singleton: boolean; whatsapp_number: string };

describe("Supabase RLS for administrative mutations", () => {
  it("does not permit a public client to modify site settings", async () => {
    const baseUrl = process.env.VITE_SUPABASE_URL;
    const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    expect(baseUrl).toBeTruthy();
    expect(publishableKey).toBeTruthy();

    const headers = {
      apikey: publishableKey!,
      Authorization: `Bearer ${publishableKey}`,
    };
    const read = await fetch(`${baseUrl}/rest/v1/site_settings?singleton=eq.true&select=singleton,whatsapp_number&limit=1`, { headers });
    expect(read.status).toBe(200);
    const [before] = await read.json() as SiteSetting[];
    expect(before).toBeTruthy();

    const mutation = await fetch(`${baseUrl}/rest/v1/site_settings?singleton=eq.true`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ whatsapp_number: before.whatsapp_number }),
    });
    const body = mutation.headers.get("content-type")?.includes("application/json") ? await mutation.json() : null;
    const blocked = mutation.status >= 400 || (Array.isArray(body) && body.length === 0);
    expect(blocked).toBe(true);

    const readAfter = await fetch(`${baseUrl}/rest/v1/site_settings?singleton=eq.true&select=whatsapp_number&limit=1`, { headers });
    const [after] = await readAfter.json() as Pick<SiteSetting, "whatsapp_number">[];
    expect(after.whatsapp_number).toBe(before.whatsapp_number);
  });
});
