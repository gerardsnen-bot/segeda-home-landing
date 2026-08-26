import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("acceso administrativo de Supabase", () => {
  const source = readFileSync(new URL("./AdminDashboard.tsx", import.meta.url), "utf8");

  it("guía el registro confirmado y permite reenviar el enlace de activación", () => {
    expect(source).toContain("emailRedirectTo: confirmationRedirect");
    expect(source).toContain("supabase.auth.resend");
    expect(source).toContain("Reenviar enlace de confirmación");
    expect(source).toContain("Cuenta creada. Revisa tu correo y confirma la cuenta");
    expect(source).toContain("resetPasswordForEmail");
    expect(source).toContain("Olvidé mi contraseña");
    expect(source).toContain("supabase.auth.updateUser");
  });
});
