import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("./Home.tsx", import.meta.url), "utf8");

describe("encabezado MDFantasy", () => {
  it("incluye los accesos sociales oficiales en lugar del menú de tres líneas", () => {
    expect(homeSource).toContain('href="https://www.tiktok.com/@mdfantasy_peru"');
    expect(homeSource).toContain('href="https://www.facebook.com/MDFantasyPE"');
    expect(homeSource).toContain('className="social-action social-whatsapp"');
    expect(homeSource).not.toContain('<Menu size={22} />');
  });

  it("mantiene la navegación principal disponible en móvil sin hamburguesa", () => {
    expect(homeSource).toContain('className="mobile-quick-nav"');
    expect(homeSource).toContain('<a href="#inicio">Inicio</a>');
    expect(homeSource).toContain('setCategoriesOpen(true)');
    expect(homeSource).toContain('<a href="#como-comprar">Cómo comprar</a>');
    expect(homeSource).toContain('<a href="#contacto">Contacto</a>');
  });

  it("incluye secciones de inspiración, ocasiones y conversión sin reseñas inventadas", () => {
    expect(homeSource).toContain('className="inspiration-section shell"');
    expect(homeSource).toContain('className="occasions-section"');
    expect(homeSource).toContain('className="signature-cta shell"');
    expect(homeSource).toContain('Hablar por WhatsApp');
    expect(homeSource).not.toMatch(/testimonio|reseña|opinión de cliente/i);
  });

  it("mantiene la ruta legada de Nubes temáticas asociada a su categoría publicada", () => {
    const categorySource = readFileSync(new URL("./Category.tsx", import.meta.url), "utf8");
    expect(categorySource).toContain('"nubes-tematicas": "nubes"');
  });
});
