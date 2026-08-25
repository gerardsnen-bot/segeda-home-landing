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
});
