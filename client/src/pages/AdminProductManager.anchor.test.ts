import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("enlaces directos de organización administrativa", () => {
  const source = readFileSync(new URL("./AdminProductManager.tsx", import.meta.url), "utf8");

  it("desplaza y enfoca un control de categoría o sección identificado en la URL", () => {
    expect(source).toContain('targetId.startsWith("placement-")');
    expect(source).toContain('targetId.replace(/^placement-(?:category|section)-/, "")');
    expect(source).toContain("setExpandedId(targetProduct.category_id)");
    expect(source).toContain("document.getElementById(targetId)");
    expect(source).toContain('target.scrollIntoView({ block: "center" })');
    expect(source).toContain('target.focus({ preventScroll: true })');
  });
});
