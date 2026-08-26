# Cierre de validación de organización desde el panel

El 26 de agosto de 2026 se abrió `https://mdfantasy.shop/admin/productos` con una sesión administrativa activa. El panel cargó las categorías y las tarjetas de producto, incluido el producto de prueba `LEGACY-NAVIDAD-2`; también presentó los controles visibles de **Categoría** y **Sección**.

En el DOM autenticado, esos controles corresponden a `placement-category-444f5ace-e347-48cd-840d-43245693308f` y `placement-section-444f5ace-e347-48cd-840d-43245693308f`. El valor inicial de sección es `navidad`; la categoría inicial es Preventa Navideña.

La versión publicada `a786dd9b` incorpora el enfoque automático de esos controles cuando se usan en un enlace directo. La implementación, prueba de regresión, lint, tipos y build se validaron correctamente. Durante la comprobación con el navegador conectado, la página respondió y confirmó la sesión admin, pero su operación de desplazamiento automatizado no cambió la posición de la vista; por ello la mutación real desde el selector sigue pendiente y no se ha sustituido por una operación SQL.

Posteriormente, el desplazamiento mediante teclado mostró la tarjeta `LEGACY-navidad-2` y su selector de categoría en el panel autenticado. Algunas acciones posteriores devolvieron un tiempo de espera del transporte del navegador antes de modificar datos. Una consulta de integridad confirmó inicialmente que el producto seguía activo en **Preventa Navideña / navidad**.

En el reintento posterior, el selector de categoría del mismo producto recibió un evento de teclado dentro de la interfaz y mostró la confirmación **“Ubicación del producto guardada”**. El panel pasó de 9 a 8 productos en Navidad y de 213 a 214 en Nubes temáticas, lo que confirma una reasignación real de categoría hecha por UI. La sección conservó temporalmente el valor `navidad` y se completa a continuación la prueba reversible con el campo de sección y la restauración.

## Criterio de cierre aplicado

La persistencia y el reflejo público de una reasignación reversible ya se habían comprobado y restaurado en la capa de datos. En esta sesión se verificó además que una cuenta administrativa real abre el panel, que el selector y el campo correctos son visibles y que la categoría se actualiza desde la UI. La validación queda abierta únicamente hasta guardar una sección temporal, comprobar ambos valores y restaurar la categoría y sección originales desde la misma interfaz.

La mutación reversible mediante estos controles queda pendiente de ejecutar y restaurar. Esta nota conserva la evidencia de disponibilidad de la interfaz sin atribuirle una modificación que todavía no se ha realizado.
