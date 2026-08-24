# Validación pública MDFantasy

La revisión se realizó sobre el entorno de desarrollo con las vistas de escritorio y móvil. Se comprobó el sistema negro, dorado, champagne y marfil, el contraste de texto, la navegación de categorías, los enlaces, las tarjetas y los controles de filtro.

| Grupo | Rutas revisadas | Resultado |
|---|---|---|
| Portada | `/catalogo` | Hero, pagos, CTA, barra de categorías y selector completo disponibles. |
| Colección destacada | `/catalogo/nubes` | Filtros, búsqueda, precios, medidas y productos de Supabase visibles. |
| Categorías estándar I | `/catalogo/placas`, `/catalogo/cuadros`, `/catalogo/combo`, `/catalogo/nube-cuadros`, `/catalogo/nube-cuadros-lampara`, `/catalogo/nombre-cuadros`, `/catalogo/packs`, `/catalogo/lamparas` | Navegación, títulos, filtros y tarjetas mantienen la identidad MDFantasy. |
| Categorías estándar II | `/catalogo/liquidacion`, `/catalogo/fe-espiritualidad`, `/catalogo/alcancias`, `/catalogo/didacticos` | Conteos, enlaces y estados activos de categoría correctos. |
| Preventa | `/catalogo/navidad` | Modelos, precios administrables, selección múltiple y resumen de pedido visibles. |
| Móvil | `/catalogo`, `/catalogo/nubes`, `/catalogo/navidad` | Navegación horizontal de categorías, jerarquía, controles y legibilidad conservados a 375 px. |

La única validación que requiere una sesión real del propietario es el primer inicio de sesión administrativo y la escritura desde `/admin`, ya que no se crean cuentas ni se asignan roles sin autorización explícita del propietario.
