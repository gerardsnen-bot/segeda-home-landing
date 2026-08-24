# Validación de navegación fija MDFantasy

## Diagnóstico

La barra de categorías se implementaba como un elemento `sticky` independiente con `top: 0` dentro de una raíz que aplicaba `overflow-x-hidden`. Esto hacía que compitiera con la cabecera y aumentaba el riesgo de que el desplazamiento y los contextos de apilamiento fueran inconsistentes.

## Corrección aplicada

La franja de confianza, el encabezado y las dos filas de categorías ahora están agrupados dentro de un único contenedor `site-chrome` con `position: sticky` y `top: 0`. La barra de categorías ya no calcula una posición independiente: permanece debajo de la cabecera por su ubicación estructural real. La raíz dejó de utilizar `overflow-x-hidden` y se define una escala explícita para contenido, navegación, overlay, carrito y modal.

## Evidencia inicial

En la sesión de navegador de escritorio, después de desplazar la landing hasta aproximadamente 1.118 px, el bloque completo de confianza, cabecera y categorías se mantuvo visible y alineado, sin espacio vacío entre el encabezado y las categorías. La prueba de carrito y los breakpoints restantes se documentarán al finalizar la validación.

Con la landing desplazada, se abrió el carrito. El drawer se mostró por encima del header y de la barra de categorías, mientras el overlay cubrió visualmente ambos elementos. El intento de desplazamiento con el carrito abierto no alteró la posición de la página, confirmando el bloqueo de scroll del documento.

La tecla `Escape` cerró el carrito y devolvió el control de desplazamiento sin reiniciar ni desalinear la posición de la barra superior.

## Validación final de breakpoints

Se revisó la landing en **1920, 1440, 1024, 768 y 390 px**. En escritorio, las dos filas de categorías se distribuyen de forma equitativa y permanecen unidas al encabezado; en 768 px conservan la misma jerarquía sin cruces con la sección de medios de pago; y en 390 px los accesos pasan a una fila táctil desplazable sin recortar el Hero ni invadir los controles de búsqueda, carrito o menú. La prueba de desplazamiento real, el overlay del carrito y el cierre con `Escape` confirman la escala de capas: contenido < navegación < overlay < drawer < modal.

En la comprobación posterior de navegación por ancla, el bloque superior permaneció fijado con el mismo orden de capas. El navegador no registró cambio de posición para el intento de desplazamiento adicional, por lo que no se usó esa interacción como evidencia de velocidad; la validación se apoya en las capturas por breakpoint, la sesión de desplazamiento anterior y el bloqueo comprobado del drawer.

## Corrección definitiva y prueba de interacción

La validación con teclado detectó que el contenedor `sticky` podía perder la referencia durante un salto profundo. Se sustituyó por un bloque superior `fixed` y un espaciador responsive que reserva sus alturas reales: franja de confianza, encabezado y dos filas de categorías. Con esta estructura, una pulsación `PageDown` y un salto `End` mantuvieron el bloque superior anclado, sin desplazamiento visible de sus capas. Desde el final de la landing se navegó correctamente a **Nubes temáticas** y **Preventa Navideña** mediante dos botones distintos de la barra. Finalmente, el carrito se abrió desde una posición profunda, oscureció el contenido y la navegación fija, mostró el drawer por encima, y se cerró con `Escape` sin alterar la posición de la página.

Las capturas post-corrección a **1920 px** y **1440 px** confirman que el espaciador coincide con el bloque fijo: no queda hueco entre las categorías y la franja de medios de pago, las dos filas mantienen su reparto equitativo y el Hero comienza debajo de la navegación sin quedar oculto.

La comprobación post-corrección a **1024 px** preserva las dos filas, los medios de pago y el Hero sin recortes. A **768 px**, el menú principal pasa a su variante compacta, mientras que las categorías y la cabecera conservan espacio suficiente y no invaden el contenido del Hero.

En un navegador móvil real emulado a **390 × 844 px**, el desplazamiento alcanzó `scrollY: 1073` mientras la cabecera permaneció en `top: 0` con `212 px` de altura. El carrito abrió un overlay con `z-index: 900`, bloqueó el scroll del documento (`overflow: hidden`) y se cerró con Escape restaurando el overflow. Finalmente, un botón de categoría navegó correctamente a `/catalogo/nubes`. La evidencia estructurada se conserva en `mdfantasy_final_audit/mobile_sticky_interaction.json`.

## Revisión visual explícita post-fix

Las cinco capturas posteriores al cambio a `fixed` fueron revisadas de forma individual. A **1920 px**, se observan diez categorías distribuidas en dos filas equitativas de cinco, sin hueco entre la barra y los medios de pago; a **1440 px** se mantiene la misma organización sin recorte del Hero; a **1024 px**, logo, navegación, carrito y ambas filas conservan separación; a **768 px**, el menú compacto aparece a la derecha y el Hero inicia bajo la barra sin ser cubierto; y a **390 px**, el logotipo, búsqueda, carrito y menú no se solapan, mientras que las categorías pasan a una franja táctil horizontal con sus primeros accesos completos y los restantes disponibles por desplazamiento lateral.

La inspección local de `postfix-breakpoints/landing_1920.png` y `postfix-breakpoints/landing_1440.png` verificó de forma visual el mismo resultado: logo completo, controles de búsqueda y carrito visibles, diez cápsulas de categoría sin superposición, separación continua hacia medios de pago y Hero íntegro debajo del espacio reservado.

La inspección local de `postfix-breakpoints/landing_1024.png` comprobó que los accesos principales, la barra de categorías y las cuatro tarjetas de pago caben sin invadir el Hero. En `postfix-breakpoints/landing_768.png`, los controles compactos de búsqueda, carrito y menú continúan separados; las dos filas de categorías no se pisan y la imagen del Hero empieza por debajo de la navegación.

La inspección local final de `postfix-breakpoints/landing_390.png` verificó que el logotipo, los controles de búsqueda, carrito y menú permanecen visibles y separados. Los cinco accesos de categoría visibles caben sin invadir el Hero y el resto se conserva en la franja horizontal táctil. Junto con `mobile_sticky_cart_overlay.png`, revisado visualmente, esta captura cierra la evidencia post-fix de la vista móvil.

La captura móvil final de carrito (`mdfantasy_final_audit/mobile_sticky_cart_overlay.png`) confirma visualmente que el drawer ocupa el primer plano de toda la pantalla: no queda cabecera ni botón de categoría por encima, el control de cierre resulta visible, y el contenido del carrito mantiene su jerarquía. Esta evidencia visual coincide con la inspección DOM del overlay (`z-index: 900`, scroll bloqueado) y con el cierre correcto por Escape.
