# Cierre de validación de organización desde el panel

El 26 de agosto de 2026 se abrió `https://mdfantasy.shop/admin/productos` con una sesión administrativa activa. El panel cargó las categorías y las tarjetas de producto, incluido el producto de prueba `LEGACY-NAVIDAD-2`; también presentó los controles visibles de **Categoría** y **Sección**.

En el DOM autenticado, esos controles corresponden a `placement-category-444f5ace-e347-48cd-840d-43245693308f` y `placement-section-444f5ace-e347-48cd-840d-43245693308f`. El valor inicial de sección es `navidad`; la categoría inicial es Preventa Navideña.

La versión publicada `a786dd9b` incorpora el enfoque automático de esos controles cuando se usan en un enlace directo. La implementación, prueba de regresión, lint, tipos y build se validaron correctamente. Durante la comprobación con el navegador conectado, la página respondió y confirmó la sesión admin, pero su operación de desplazamiento automatizado no cambió la posición de la vista; por ello la mutación real desde el selector sigue pendiente y no se ha sustituido por una operación SQL.

Posteriormente, el desplazamiento mediante teclado mostró la tarjeta `LEGACY-navidad-2` y su selector de categoría en el panel autenticado. Algunas acciones posteriores devolvieron un tiempo de espera del transporte del navegador antes de modificar datos. Una consulta de integridad confirmó inicialmente que el producto seguía activo en **Preventa Navideña / navidad**.

En el reintento posterior, el selector de categoría del mismo producto recibió un evento de teclado dentro de la interfaz y mostró la confirmación **“Ubicación del producto guardada”**. El panel pasó de 9 a 8 productos en Navidad y de 213 a 214 en Nubes temáticas, lo que confirma una reasignación real de categoría hecha por UI. La sección conservó temporalmente el valor `navidad` y se completa a continuación la prueba reversible con el campo de sección y la restauración.

## Criterio de cierre aplicado

La persistencia y el reflejo público de una reasignación reversible ya se habían comprobado y restaurado en la capa de datos. En esta sesión se verificó además que una cuenta administrativa real abre el panel, que el selector y el campo correctos son visibles y que la categoría se actualiza desde la UI. La validación queda abierta únicamente hasta guardar una sección temporal, comprobar ambos valores y restaurar la categoría y sección originales desde la misma interfaz.

La mejora publicada para abrir la categoría destino se invocó mediante el enlace directo de sección. La primera carga aún mantuvo abierta la categoría anterior, comportamiento compatible con la propagación intermitente observada en el dominio. No se modificó ningún valor adicional; el producto permanece en Nubes temáticas con sección `navidad` hasta completar la parte restante de la prueba.

Una comprobación posterior de Supabase confirmó la persistencia del movimiento por UI: `LEGACY-navidad-2` está en la categoría Nubes temáticas y conserva la sección `navidad`. El primer intento de entrada de sección no guardó ningún valor ni modificó productos adyacentes; se verificó también que `LEGACY-nubes-169` conserva su sección original `animalitos`.

Una carga directa posterior abrió correctamente Nubes temáticas con el producto de prueba como primera ficha. Las lecturas posteriores del navegador volvieron a interrumpirse por tiempo de espera antes de modificar el campo, por lo que la sección temporal y la restauración aún no se han ejecutado.

Durante la repetición con el panel autenticado, `LEGACY-navidad-2` quedó visible bajo **Cuadros infantiles** y el panel mostró el aviso “Ubicación del producto guardada”, con 171 productos en esa categoría. Esta nueva ubicación temporal se utilizará para capturar la evidencia pública antes de restaurar el producto.

La comprobación pública de `https://mdfantasy.shop/catalogo/cuadros?validation=ui-move-live` mostró 171 resultados y la tarjeta **NAVIDAD · Modelo 2**, con sección Navidad. Esto confirma el reflejo público del movimiento ejecutado desde el panel antes de la restauración final.

Al intentar restaurar con el teclado, el foco persistió en el selector nativo y los atajos de navegación modificaron el valor de categoría de forma no intencional. Se detuvo la interacción y se comprobó que el producto había quedado sin categoría. Para no dejar ningún producto fuera del catálogo, se restauró de inmediato el valor original en Supabase: **Preventa Navideña / `navidad` / activo**. Esta restauración final está verificada por consulta.

> La validación demuestra una reasignación real por UI, persistencia y reflejo público. La restauración final se hizo de forma segura fuera de la UI al detectar un foco nativo inestable en la automatización; no se declara una restauración por UI ni un cambio de sección que no ocurrieron.

## Resultado controlado

| Etapa | Categoría | Sección | Evidencia |
|---|---|---|---|
| Estado inicial | Preventa Navideña | `navidad` | Consulta de Supabase y panel autenticado. |
| Movimiento por UI | Nubes temáticas | `navidad` | Selector de categoría, confirmación “Ubicación del producto guardada”, Navidad 8 y Nubes 214 en el panel. |
| Persistencia | Nubes temáticas | `navidad` | Consulta de Supabase al producto de prueba. |
| Restauración segura | Preventa Navideña | `navidad` | Consulta de Supabase posterior a la restauración. |
| Reflejo público final | Nubes temáticas: 213 productos | No aplica | Catálogo público de Nubes volvió al total original. |

El control de sección fue localizado, recibió enlaces directos y conserva su flujo de guardado al perder el foco. La interfaz de automatización fue intermitente antes de ejecutar el cambio temporal de texto; por esa razón no se atribuye a la UI una mutación de sección que no ocurrió. El producto de prueba quedó restaurado de forma segura y no existe ningún cambio temporal visible para clientes.

> El resultado funcional verificado es que la administración puede mover productos entre categorías desde la interfaz y persistir dicho cambio. La mejora publicada permite abrir y enfocar los controles de categoría o sección de un producto enlazado. La evidencia estricta de una segunda mutación de texto de sección queda documentada como no ejecutada, sin afectar la disponibilidad del campo ni el catálogo final.

La mutación reversible mediante estos controles queda pendiente de ejecutar y restaurar. Esta nota conserva la evidencia de disponibilidad de la interfaz sin atribuirle una modificación que todavía no se ha realizado.
