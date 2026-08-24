import { describe, expect, it } from "vitest";
import { createProductSku, toCatalogSlug } from "./adminUtils";

describe("admin catalog helpers", () => {
  it("creates safe catalog slugs from Spanish names", () => {
    expect(toCatalogSlug("Nube + Cuadros · Niña")).toBe("nube-cuadros-nina");
  });

  it("creates a predictable SKU when a timestamp is supplied", () => {
    expect(createProductSku("Placa circular", 171234567890)).toBe("PLACA-CIRCULAR-567890");
  });
});
