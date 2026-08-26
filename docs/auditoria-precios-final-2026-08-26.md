# Auditoría final de precios y variantes

La fuente original de Segeda Home expone 674 productos mediante su API estructurada. Para los 94 productos que no tuvieron asociación única en la sincronización inicial, se revisaron nuevamente imagen, categoría y perfil completo de variantes.

| Resultado | Productos | Tratamiento |
|---|---:|---|
| Asociación única o perfil de precio idéntico | 85 | Variantes sincronizadas desde la fuente estructurada. |
| Preventa Navideña | 9 | Precio público de preventa de S/79 por letrero, verificado en la página de Navidad. |
| Productos sin tarifa numérica en la fuente | 9 | La fuente los muestra como “Precio por consultar”; no se les asigna un importe inventado. |

La página original de Didácticos presenta tres productos como **“Precio por consultar”**, no como S/0. El mismo criterio se aplica a los productos restantes sin importe publicado en la fuente. [1]

La validación posterior en la base de datos confirmó que los **683 productos activos** quedan cubiertos de la misma forma que su fuente: **674** tienen una variante activa con precio positivo y **9** conservan una modalidad sin tarifa pública. Se actualizaron o insertaron **122 variantes** sobre los 94 productos revisados. La interfaz pública presenta estos últimos como “Precio por consultar” y los dirige a WhatsApp, evitando que se agreguen al carrito con un importe de S/0.

La colección de Preventa Navideña quedó con S/79 por letrero como precio unitario de preventa; la oferta por dos o más unidades se mantiene como condición comercial de la colección, no como precio base individual. [2]

## Referencias

[1]: https://segeda-home-tienda.mad-elynnlevon7.chatgpt.site/catalogo?categoria=didacticos "Catálogo original de Didácticos de Segeda Home"
[2]: https://segeda-home-tienda.mad-elynnlevon7.chatgpt.site/navidad "Preventa Navideña original de Segeda Home"
