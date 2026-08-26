# Cierre de clasificación visual como Mix

## Decisión aplicada

Por instrucción del propietario, los productos que seguían sin evidencia visual suficiente dejaron de estar en espera de una nueva clasificación automática. Se mantienen publicados, pero ahora usan el estado persistente **`mix`**, que no los presenta como una clasificación visual verificada de Niña, Niño ni Unisex.

| Estado público | Total activo | Tratamiento |
| --- | ---: | --- |
| Niña verificada | 170 | Filtro Niña |
| Niño verificado | 67 | Filtro Niño |
| Unisex verificado | 194 | Disponible en Todos y Unisex interno |
| Mix | 252 | Filtro Mix, sin inferencia de género |

La distribución de Mix se concentra en Nubes temáticas, con 142 productos; Cuadros infantiles tiene 98 y Combo completo 12. Las demás categorías activas no tienen productos Mix al cierre de esta actualización.

## Catálogo público

Cada categoría incorpora el botón **Mix** junto con Todos, Niña y Niño. El filtro identifica los productos mediante su estado de revisión persistente, por lo que los resultados no dependen de títulos, colores, texto de imagen ni heurísticas. En Nubes temáticas, la interfaz valida 142 productos Mix en escritorio y móvil.

## Organización desde el panel

El panel de Productos ahora muestra, en cada ficha, un selector de **Categoría** y un campo de **Sección**. La categoría se guarda inmediatamente al seleccionar un destino y la sección se guarda al finalizar la edición del campo. La sección reutiliza el campo `theme_group`, que alimenta las agrupaciones públicas cuando existe más de una sección en una categoría.

La política `products_staff_manage` concede a perfiles administrativos autenticados la actualización de productos. Los productos Mix pueden moverse entre categorías y secciones sin volver a entrar en clasificación visual.

La validación operativa usó `LEGACY-navidad-2` de forma controlada: se movió desde **Preventa Navideña / navidad** a **Nubes temáticas / validacion-admin-mix**. El catálogo público mostró 214 productos y presentó `Modelo 2` bajo la nueva sección, confirmando la persistencia y el reflejo público. A continuación se restauró el producto a su categoría y sección originales. Esta comprobación validó la capa de datos y el reflejo público; la prueba del mismo movimiento mediante la interacción directa de los controles del panel queda registrada como verificación final pendiente.

Tras la restauración, la categoría pública de Nubes volvió a mostrar **213 diseños**, desapareció la sección temporal `Validacion Admin Mix` y el producto de prueba dejó de figurar en esa categoría.

## Programación visual

La programación de reanudación visual se encontraba pausada y permanece desactivada. Por tanto, los 252 productos Mix no se reenviarán para clasificación automática.

## Propagación de producción

La vista de desarrollo ya muestra el filtro Mix con 142 productos en Nubes temáticas. La comprobación inicial de producción mostró un bundle anterior y, una vez propagado el nuevo bundle, la consulta pública quedó vacía por caché de esquema de PostgREST. Se recargó explícitamente el esquema de Supabase y la categoría volvió a presentar sus 213 diseños.

La comprobación final de `https://mdfantasy.shop/catalogo/nubes?v=mix-schema-reload-3` confirmó el botón **Mix · 142**. Al activarlo, la categoría presentó exactamente **142 resultados** y los productos correspondientes, sin ocultarlos ni reclasificarlos como Niña o Niño.
