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

Se programó una ejecución única para retomar en 12 horas exclusivamente los 252 productos `pending_review`. El proceso deberá comprobar disponibilidad antes de llamar al servicio de visión, conservar los resultados verificables, respetar cualquier `gender_source = manual` y actualizar los conteos finales.
