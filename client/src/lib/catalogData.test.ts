import { describe, expect, it } from "vitest";
import { CatalogProduct, genderTargetToAudience, matchesCatalogAudience } from "./catalogData";

describe("genderTargetToAudience", () => {
  it("expone las clasificaciones persistentes con las etiquetas de filtros públicas", () => {
    expect(genderTargetToAudience("girl", null)).toBe("niña");
    expect(genderTargetToAudience("boy", null)).toBe("niño");
    expect(genderTargetToAudience("unisex", null)).toBe("unisex");
  });

  it("conserva el público heredado si no existe una clasificación visual", () => {
    expect(genderTargetToAudience(null, "niña")).toBe("niña");
    expect(genderTargetToAudience(null, null)).toBe("unisex");
  });

  it("reserva Mix solo para productos pendientes y no obliga una etiqueta de género", () => {
    const pending: CatalogProduct = {
      id: "pending", title: "Diseño pendiente", description: "", price: 50, compareAtPrice: 0, sizes: [], tags: "", audience: "unisex", genderTarget: "unisex", genderReviewStatus: "pending_review", themeGroup: "", estimatedDays: "", featured: false, imageUrl: "", galleryUrls: [],
    };
    const mix: CatalogProduct = { ...pending, id: "mix", genderReviewStatus: "mix" };
    const classified: CatalogProduct = { ...pending, id: "classified", genderReviewStatus: "classified", audience: "niña", genderTarget: "girl" };

    expect(matchesCatalogAudience(pending, "mix")).toBe(true);
    expect(matchesCatalogAudience(mix, "mix")).toBe(true);
    expect(matchesCatalogAudience(classified, "mix")).toBe(false);
    expect(matchesCatalogAudience(pending, "todos")).toBe(true);
    expect(matchesCatalogAudience(classified, "niña")).toBe(true);
  });
});
