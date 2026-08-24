import { describe, expect, it } from "vitest";
import { genderTargetToAudience } from "./catalogData";

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
});
