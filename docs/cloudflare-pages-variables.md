# Variables de Cloudflare Pages

Configura estas dos variables **de texto plano** en Cloudflare Pages, para los entornos de producción y vista previa:

| Variable | Valor |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase MDFantasy |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave pública/publishable de Supabase |

> No agregues `service_role`, claves privadas de Supabase ni claves de administración de Cloudflare al frontend ni al repositorio.

El proyecto es una aplicación Vite estática. Cloudflare Pages debe usar:

```text
Build command: pnpm install --frozen-lockfile && pnpm build:static
Build output directory: dist
Production branch: main
```

La regla `_redirects` incluida en `client/public` hace que las rutas públicas y `/admin` funcionen al recargar la página.
