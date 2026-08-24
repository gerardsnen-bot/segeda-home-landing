# Clasificación visual parcial de públicos — MDFantasy

**Fecha:** 24 de agosto de 2026.  
**Estado:** Backfill parcial aplicado; reanudación única programada para los casos pendientes.

## Alcance y criterio

Se analizaron las imágenes principales una por una, sin usar el nombre, la descripción ni el color como único indicador. Los productos con señales visuales no concluyentes se orientaron a **unisex**; los que no pudieron analizarse por falta temporal de disponibilidad del servicio quedaron marcados como `pending_review`, sin una asignación especulativa.

| Estado | Niña | Niño | Unisex | Total |
|---|---:|---:|---:|---:|
| Clasificación visual verificada | 170 | 67 | 194 | 431 |
| Pendiente de revisión | — | — | 252 | 252 |
| **Catálogo activo** | **170** | **67** | **446** | **683** |

La asignación **efectiva** se guardó en `gender_target`; la evidencia de modelo, confianza y señales visuales se preservó en los campos automáticos. Las 252 filas sin análisis se mantienen en `unisex` de forma provisional y llevan `gender_review_status = pending_review`, por lo que no se presentan como una recomendación verificada.

## Integración de catálogo y administración

Los filtros públicos ahora interpretan la clasificación persistente: `girl → Niña`, `boy → Niño` y `unisex → Unisex`. En la comprobación de Nubes temáticas, el filtro **Niña** mostró 47 resultados y **Niño** mostró 13, sin esperar a que termine el lote pendiente. La consulta de categoría se hizo explícita por `category_id` tras detectar que el join público podía devolver una lista vacía de forma intermitente.

El gestor administrativo incorpora el selector **Automático, Niña, Niño y Unisex** en cada producto. Una elección manual fija `gender_source = manual`; volver a Automático restaura la última propuesta visual preservada. Los productos sin propuesta visible muestran “Automático · Pendiente” y no reciben una clasificación inventada.

## Continuidad

Se programó una ejecución única para retomar exclusivamente los 252 productos `pending_review` el **25 de agosto de 2026 a las 02:46 (America/Bogota)**, doce horas después de la confirmación del usuario. El proceso deberá comprobar disponibilidad antes de llamar al servicio de visión, conservar los resultados verificables, respetar cualquier `gender_source = manual` y actualizar los conteos finales.

## Validación de persistencia y experiencia

Una consulta directa a Supabase posterior al backfill confirmó cuatro grupos exactos: **67** `boy / classified / auto`, **170** `girl / classified / auto`, **194** `unisex / classified / auto` y **252** `unisex / pending_review / auto`. No se detectaron overrides manuales existentes, por lo que el backfill no reemplazó decisiones del administrador. Los 252 pendientes permanecen como unisex provisional únicamente para no ocultar productos y no se consideran clasificación visual verificada.

La ruta Nubes temáticas volvió a cargar después de sustituir un join público inestable por un filtro explícito de `category_id`; los controles públicos Niña y Niño mostraron sus resultados parciales sin esperar los pendientes. El panel administrativo mostró el selector Automático, Niña, Niño y Unisex. La validación técnica aprobó `lint`, **13 pruebas**, comprobación de tipos y build. Las pruebas responsive y de navegación fija se documentan en [`validacion-navegacion-fija.md`](./validacion-navegacion-fija.md).

La comprobación en el dominio publicado confirmó **47 resultados** con el filtro **Niña** y **13 resultados** con el filtro **Niño** dentro de Nubes temáticas. Ambas vistas mostraron tarjetas de producto reales, precios y medidas; por tanto, los filtros ya consumen datos persistentes del backfill parcial.

Un reintento inmediato posterior generó 32 respuestas temporales sin contenido clasificable. Esas filas se conservan únicamente como registro técnico local y **no** se enviaron a Supabase ni se añadieron al backfill. La fuente de verdad publicada permanece en las 431 clasificaciones verificadas y los 252 registros `pending_review`.

El bloque de contacto publicado fue actualizado y verificado con el canal **TikTok: MDFantasy**; la referencia anterior de Instagram ya no se muestra.
