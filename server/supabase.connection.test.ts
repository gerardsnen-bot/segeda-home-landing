import { describe, expect, it } from "vitest";

describe("Supabase public catalog connection", () => {
  it("accepts the configured project URL and public key for a lightweight category query", async () => {
    const baseUrl = process.env.VITE_SUPABASE_URL;
    const publishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    expect(baseUrl).toMatch(/^https:\/\/[a-z0-9-]+\.supabase\.co$/);
    expect(publishableKey).toBeTruthy();

    const response = await fetch(`${baseUrl}/rest/v1/categories?select=id&limit=1`, {
      headers: {
        apikey: publishableKey!,
        Authorization: `Bearer ${publishableKey}`,
      },
    });

    expect(response.status).toBe(200);
  });
});
