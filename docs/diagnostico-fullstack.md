# Diagnóstico de migración full stack — Segeda Home

**Estado auditado:** catálogo existente de Segeda Home.  
**Objetivo de migración:** mantener la experiencia pública actual y reemplazar progresivamente los datos embebidos por contenido administrable, protegido y escalable.

## Resumen ejecutivo

El proyecto es una aplicación pública **React 19 + TypeScript + Vite + Tailwind CSS 4**, con enrutamiento del lado del cliente mediante Wouter. La publicación actual es estática: el servidor Express únicamente entrega la compilación del frontend y no contiene endpoints de negocio, autorización, persistencia ni conexión a base de datos.

El catálogo ya presenta una buena base visual y de navegación, pero sus datos se distribuyen entre arreglos en componentes, una instantánea JSON alojada como activo estático y enlaces a imágenes de almacenamiento administrado. La migración puede realizarse sin reconstruir la interfaz si se preservan las estructuras de datos que consumen las páginas y se introducen servicios de lectura compatibles antes de retirar las fuentes actuales.

| Área | Estado actual | Acción de migración |
|---|---|---|
| Catálogo público | React, Wouter, componentes de página | Mantener vistas y sustituir fuentes estáticas por consultas paginadas |
| Productos estándar | JSON estático en `manus-storage` | Migrar a `products`, `product_images` y variantes/medidas |
| Navidad | Arreglo de 9 modelos en `Navidad.tsx` | Migrar a colección y productos de preventa |
| Categorías | Arreglos repetidos en `Home.tsx` y `Category.tsx` | Centralizar en tabla `categories` |
| Imágenes | URLs `/manus-storage/*` | Registrar en biblioteca multimedia y migrar gradualmente a Storage |
| Carrito | `localStorage` | Mantener como experiencia de visitante; no usarlo como fuente de catálogo |
| WhatsApp | Constantes repetidas en páginas | Mover a configuración de sitio y plantillas de mensaje |
| Auth / Admin | No implementados | Añadir autenticación, roles, RLS y `/admin` |

## Stack detectado

| Capa | Implementación encontrada | Observación |
|---|---|---|
| Cliente | React 19, TypeScript estricto, Vite 7 | Estructura adecuada para conservar el diseño actual |
| Estilos | Tailwind CSS 4, CSS de página embebido | Conviene conservar inicialmente y extraer solo reglas compartidas durante la migración |
| Enrutamiento | Wouter | Rutas públicas simples en `client/src/App.tsx` |
| Interacción | React Hook Form, Zod y shadcn/ui disponibles | Buen punto de partida para formularios de administración y validación |
| Servidor | Express mínimo | Actualmente solo sirve archivos compilados; no expone APIs |
| Datos | JSON estático y arreglos en componentes | No existe base de datos ni capa de repositorios |
| Medios | Rutas `/manus-storage/*` mediante proxy de Vite | Las imágenes actuales deben preservarse durante la transición |
| Autenticación | No implementada | Existe un helper de plantilla, pero no hay protección de rutas ni sesión administrativa |
| Supabase | No instalado | No existe `@supabase/supabase-js`, cliente, migración, RLS ni Storage integrado |

## Estructura de carpetas actual

```text
client/
  src/
    pages/            Home.tsx, Category.tsx, Navidad.tsx, NotFound.tsx
    components/       ErrorBoundary, UI de shadcn y compatibilidad
    contexts/         ThemeContext
    hooks/            hooks de plantilla
    lib/              segedaCart.ts, utilidades
    App.tsx           rutas de la aplicación
    index.css         tokens y estilos globales
server/
  index.ts            servidor estático Express
shared/
  const.ts            compatibilidad de plantilla
docs/
  diagnostico-fullstack.md
```

## Funcionamiento actual del catálogo

La ruta `/catalogo` resuelve a `Home.tsx`; también se usa como ruta raíz. La ruta `/catalogo/navidad` usa una página específica para la preventa y `/catalogo/:category` renderiza la plantilla de categorías estándar. Todas las transiciones internas se realizan con Wouter y los enlaces de categoría llevan a los slugs definidos en los componentes.

La página de categoría estándar descarga una instantánea JSON de catálogo desde `segeda-real-products_742b0de3.json`, alojada en `/manus-storage`. La interfaz filtra, ordena y pagina en memoria sobre ese contenido descargado. Esta es la parte más cercana a una fuente dinámica, pero no cuenta con consultas filtradas del servidor, escritura, control de acceso ni paginación en base de datos.

## Ubicación de contenido y datos actuales

| Contenido | Ubicación actual | Estado |
|---|---|---|
| Hero, franja de pagos, categorías destacadas, secciones y footer | `client/src/pages/Home.tsx` | Hardcoded |
| Selector completo de categorías | `Home.tsx`, arreglo `allCategories` | Hardcoded |
| Categorías e iconos de navegación | `Home.tsx` y `Category.tsx` | Hardcoded y duplicado |
| Productos estándar, precios, tamaños y galerías | JSON estático de `manus-storage` | Lectura pública estática |
| Filtros y orden de productos | `Category.tsx` | Lógica de cliente sobre JSON |
| Pre-venta de Navidad y sus nueve modelos | `Navidad.tsx`, arreglo `models` | Hardcoded |
| Precios por cantidad en Navidad | `Navidad.tsx` | Lógica en memoria |
| Carrito del visitante | `client/src/lib/segedaCart.ts` | `localStorage`, no es base de datos |
| WhatsApp | Constantes en `Home.tsx` y `Navidad.tsx` | Hardcoded y duplicado |
| Imágenes | URLs `/manus-storage/*` | Activos externos gestionados por el proyecto |

## Contenido dinámico frente a hardcoded

Actualmente, el catálogo estándar carga productos desde un activo JSON y el carrito conserva la selección localmente. Todo el resto del contenido comercial relevante —incluidos hero, categorías, textos, WhatsApp, modelos navideños, secciones y destacados— está escrito en archivos React.

No hay una fuente de verdad única para categorías, número de WhatsApp, orden de visualización, SEO ni imágenes. La primera etapa de la migración debe crear esa fuente única sin retirar las referencias actuales hasta comparar conteos, precios, imágenes y rutas.

## Seguridad y autenticación actuales

No existe una ruta `/admin`, control de sesión, roles, autorización de servidor, políticas RLS, validación de subida ni separación de permisos. El servidor Express no posee rutas de API y no debe recibir responsabilidades de administración sin aplicar validación y autorización adecuadas.

El tema visual persiste opcionalmente en `localStorage`; el carrito también se conserva allí. Esto es válido para una sesión de visitante, pero no debe utilizarse para administrar productos, contenido ni usuarios.

## Riesgos de migración

| Riesgo | Impacto | Mitigación obligatoria |
|---|---|---|
| Perder productos al reemplazar el JSON | Alto | Importar, contar, comparar precios, categorías e imágenes antes de cambiar el frontend |
| Romper URLs o la navegación actual | Alto | Conservar rutas `/catalogo`, `/catalogo/navidad` y `/catalogo/:category` |
| Exponer claves o privilegios | Crítico | Usar secretos de servidor y no incluir `service_role` en el cliente |
| Pérdida de imágenes | Alto | Mantener URLs actuales durante la transición y registrar rutas antes de mover archivos |
| Cambios visuales no deseados | Medio | Mantener componentes públicos y sustituir únicamente sus fuentes de datos |
| Operaciones destructivas | Alto | Soft delete, confirmaciones y registro de auditoría |
| Escalabilidad deficiente | Medio | Índices, filtros de servidor, paginación e imágenes optimizadas |

## Archivos que deberán modificarse

| Archivo o área | Motivo |
|---|---|
| `client/src/App.tsx` | Añadir rutas protegidas y `/admin` sin alterar las públicas |
| `client/src/pages/Home.tsx` | Consumir configuración pública, categorías y destacados desde servicios |
| `client/src/pages/Category.tsx` | Reemplazar la descarga del JSON por consulta paginada y filtrada |
| `client/src/pages/Navidad.tsx` | Leer colección, reglas de precio y modelos desde la base de datos |
| `client/src/lib/segedaCart.ts` | Conservar el carrito de visitante, pero enlazar IDs reales y datos de producto |
| `server/index.ts` y nuevas rutas de servidor | Añadir endpoints protegidos, importación y operaciones administrativas |
| Nuevos módulos `services/`, `repositories/`, `schemas/` y `admin/` | Separar UI, validación, negocio y persistencia |
| `vite.config.ts` | Ajustar solamente si requiere un proxy de desarrollo para nuevas rutas |

## Archivos que no deben modificarse sin necesidad

| Archivo o área | Razón |
|---|---|
| Rutas públicas existentes | Deben conservarse para no romper enlaces compartidos |
| Estilos visuales consolidados de las páginas públicas | Son la referencia visual que se desea preservar |
| Activos actuales en `manus-storage` | Deben seguir funcionando hasta que existan equivalentes verificados en Storage |
| Configuración de analytics del template | Debe preservarse salvo que la configuración administrable la sustituya de manera validada |

## Esquema PostgreSQL propuesto

La propuesta evita duplicación y deja preparada la administración por roles, versiones y medios. Las variaciones de medida se modelan por separado para reflejar precios reales por tamaño.

```text
profiles (id PK -> auth.users, full_name, role, active, created_at)
categories (id, name, slug, description, image_media_id, icon, active, sort_order,
            seo_title, seo_description, deleted_at, created_at, updated_at)
products (id, sku, name, slug, short_description, description, category_id,
          status, featured, is_new, is_offer, stock, currency, sort_order,
          seo_title, seo_description, deleted_at, created_at, updated_at)
product_variants (id, product_id, label, sku_suffix, price, compare_at_price,
                  sale_price, stock, sort_order, active)
product_images (id, product_id, media_id, alt_text, is_primary, sort_order)
tags (id, name, slug)
product_tags (product_id, tag_id)
collections (id, name, slug, description, type, active, sort_order)
collection_products (collection_id, product_id, sort_order)
media_library (id, storage_path, public_url, mime_type, size_bytes, width,
               height, alt_text, created_by, created_at, deleted_at)
site_settings (id singleton, business_name, whatsapp_number, default_message,
               email, phone, address, social_links, logo_media_id, favicon_media_id,
               seo_defaults, analytics_settings, updated_at)
hero_slides (id, title, subtitle, description, desktop_media_id, mobile_media_id,
             primary_cta, secondary_cta, active, sort_order, starts_at, ends_at)
site_sections (id, section_key, title, subtitle, description, payload_json,
               active, sort_order, updated_at)
imports (id, source_file_media_id, mode, status, summary_json, created_by, created_at)
import_rows (id, import_id, row_number, payload_json, status, errors_json, product_id)
audit_logs (id, actor_id, action, entity_type, entity_id, before_json, after_json, created_at)
```

Las políticas RLS deberán permitir lectura pública solamente de entidades publicadas y activas. Las mutaciones deberán estar limitadas a `super_admin`, `admin` o `editor` según permiso, aplicadas tanto en base de datos como en rutas de servidor.

## Plan de migración propuesto

| Fase | Resultado verificable |
|---|---|
| 1. Auditoría | Diagnóstico, inventario de datos y mapa de componentes completados |
| 2. Respaldo e infraestructura | Checkpoint y copia de seguridad; proyecto con backend, autenticación y almacenamiento habilitados |
| 3. Esquema y RLS | Migraciones reproducibles, tablas, índices, roles y políticas aplicadas |
| 4. Importación base | Categorías, productos, medidas, galerías y configuración importados y comparados |
| 5. Lectura pública | Catálogo conectado a consultas paginadas sin cambiar las URLs ni el diseño |
| 6. Acceso y dashboard | `/admin` protegido, login, roles y métricas administrativas básicas |
| 7. Gestión de catálogo | CRUD de productos, categorías, imágenes, orden, papelera y acciones masivas |
| 8. Importador | Plantilla CSV/XLSX, previsualización, validación, upsert por SKU e historial |
| 9. Editor visual | Vista espejo, drawers de edición, borrador, preview y publicación |
| 10. Configuración y SEO | Hero, secciones, contacto, WhatsApp, medios, SEO, sitemap y robots |
| 11. Seguridad y QA | Pruebas de RLS, rutas protegidas, archivos, responsive, rendimiento y regresión visual |

## Decisión de ejecución inmediata

La siguiente acción segura es habilitar la capacidad full stack del proyecto, crear el respaldo de código y obtener el esquema de backend generado por la plataforma. A continuación se definirá la migración SQL y se preparará una importación no destructiva del catálogo existente. Ningún arreglo actual ni activo será eliminado hasta que la copia en base de datos haya sido verificada.
