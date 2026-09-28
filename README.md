# MDFantasy — sitio independiente

Esta es la versión autónoma de **MDFantasy**. El frontend es una aplicación React/Vite estática y sus datos, autenticación administrativa y biblioteca de imágenes se gestionan directamente con **Supabase**. No necesita el backend, el OAuth ni el almacenamiento de Manus.

## Servicios que deben conservarse

| Función | Servicio | Estado |
|---|---|---|
| Código fuente y respaldos | GitHub: `gerardsnen-bot/segeda-home-landing` | Fuente de verdad del código |
| Catálogo, precios, usuarios y Storage | Supabase: `vrusfoxihkjywmvdveoy` | Fuente de verdad de datos |
| Hosting, CDN y DNS | Cloudflare Pages + zona `mdfantasy.shop` | Preparado; requiere reconectar GitHub Pages en Cloudflare |

## Ejecutar localmente

```bash
pnpm install --frozen-lockfile
# crear manualmente un archivo .env.local, sin subirlo a Git
pnpm dev
```

El archivo `.env.local` debe contener únicamente valores públicos de Supabase:

```text
VITE_SUPABASE_URL=https://vrusfoxihkjywmvdveoy.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu_clave_publishable_de_supabase
```

> Nunca incluyas una clave `service_role` ni secretos de administración en un frontend.

## Validar y compilar

```bash
pnpm test
# equivalente a: pnpm check && pnpm build:static
```

El resultado de publicación se genera en `dist/`. La regla `client/public/_redirects` permite cargar rutas como `/admin` o categorías directamente en Cloudflare Pages.

## Publicación en Cloudflare Pages

En Cloudflare, conecta el repositorio GitHub y configura:

| Ajuste | Valor |
|---|---|
| Production branch | `main` |
| Build command | `pnpm install --frozen-lockfile && pnpm build:static` |
| Build output directory | `dist` |
| Root directory | `/` |

Añade, tanto para **Production** como **Preview**, las variables que se describen en [`docs/cloudflare-pages-variables.md`](docs/cloudflare-pages-variables.md).

## Supabase Auth

En **Supabase → Authentication → URL Configuration**, establece la URL del sitio final como `Site URL` y añade como Redirect URLs:

```text
https://mdfantasy.shop/admin
https://www.mdfantasy.shop/admin
https://<tu-proyecto>.pages.dev/admin
```

La cuenta administradora conserva su perfil y permisos existentes en Supabase. El acceso al panel se realiza desde `/admin` mediante correo y contraseña de Supabase.

## Respaldos

- El catálogo público en el momento de la independencia está en `supabase/backups/`, acompañado por su checksum SHA-256.
- El esquema, RLS y la evolución histórica están en `supabase/migrations/`.
- Los activos que antes estaban exclusivamente en Manus se encuentran en `client/public/assets/legacy/`.
- Para generar otro respaldo público desde un entorno que tenga configuradas las dos variables públicas de Supabase, ejecuta:

```bash
node scripts/export-public-supabase-backup.mjs
```

## Migración de imágenes de producto

La función temporal `migrate-product-images` pasa imágenes externas al bucket `mdfantasy-media` de Supabase. Su código se conserva en `supabase/functions/migrate-product-images/` y el ejecutor de lotes está en `scripts/run-product-image-migration.sh`.

Después de confirmar que no quedan URLs externas en `product_images`, la función puede eliminarse desde Supabase Dashboard.

## Corte de DNS

La zona Cloudflare fue preparada sin cambiar los nameservers todavía. La guía de corte seguro está en [`docs/cutover-checklist.md`](docs/cutover-checklist.md). No cambies DNS hasta que Pages haya realizado una publicación correcta y se haya probado su dominio `*.pages.dev`.
