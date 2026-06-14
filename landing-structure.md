# ESTRUCTURA DE LANDING PAGE — SEGEDA HOME
> **Versión:** 2.0 | **Fecha:** Mayo 2026  
> **Documento:** Arquitectura de contenido, copy comercial y estrategia de conversión por sección

---

## PRINCIPIO RECTOR DE CONVERSIÓN

```
EMOCIÓN → DESEO → CONFIANZA → ACCIÓN
```

Cada sección tiene un rol específico en este embudo. El visitante llega con una necesidad emocional
(quiere lo mejor para su bebé), descubre los productos, gana confianza progresivamente y finalmente
actúa. El WhatsApp es el único destino de conversión — todo el diseño y copy apunta a ese botón.

---

## ELEMENTOS PERMANENTES (presentes en toda la página)

### 🔝 NAVBAR STICKY
**Rol:** Acceso inmediato a WhatsApp en cualquier punto del scroll.

**Contenido:**
- Logo SEGEDA HOME (izquierda)
- Slogan mini: *"Ilusión hecha decoración"* (solo desktop, texto pequeño)
- Botón CTA: `💬 Escríbenos` (mobile) / `💬 Escríbenos al WhatsApp` (desktop) — color dorado

**Comportamiento:**
- Mobile: solo logo + botón WhatsApp
- Fondo crema con leve sombra al hacer scroll
- Sticky top: 0 con z-index alto

**Enlace WhatsApp global:**
```
https://wa.me/51978642447?text=Hola%20SEGEDA%20HOME!%20Me%20interesa%20una%20decoraci%C3%B3n%20personalizada%20%F0%9F%8C%9F
```

---

### 💬 BOTÓN FLOTANTE WHATSAPP
**Rol:** CTA de rescate — visible cuando el usuario no ve ningún otro botón.

**Contenido:**
- Ícono WhatsApp verde + texto: *"¡Pide aquí!"*
- Posición: bottom-right fijo, siempre visible
- Animación: pulso suave cada 4 segundos
- Badge: *"Respuesta rápida 🕐"*

---

## MAPA DE SECCIONES — ORDEN ESTRATÉGICO

| # | Sección | Rol en el embudo | Emoción objetivo |
|---|---|---|---|
| 01 | Hero Principal | Captura y retención | Magia + deseo inmediato |
| 02 | Beneficios Rápidos | Validación de la decisión | Seguridad + confianza inicial |
| 03 | Categorías y Precios | Despertar el deseo de compra | Deseo + imaginación |
| 04 | Galería de Trabajos Reales | Prueba social visual | Confianza + credibilidad |
| 05 | Testimonios de Clientes | Prueba social textual | Tranquilidad + identificación |
| 06 | Personalización | Conectar con la visión del cliente | Ilusión + proyección |
| 07 | Cómo Comprar | Eliminar miedo al proceso | Claridad + seguridad |
| 08 | Materiales y Calidad | Justificar el valor | Confianza en la calidad |
| 09 | Pagos y Adelanto 50% | Resolver objeción de pago | Transparencia + confianza |
| 10 | Envíos a Todo el Perú | Eliminar barrera geográfica | Inclusión + alcance |
| 11 | Cuidados del Producto | Percepción de durabilidad | Confianza post-compra |
| 12 | Redes Sociales | Ampliar la relación con la marca | Comunidad + seguimiento |
| 13 | Preguntas Frecuentes | Resolver últimas objeciones | Claridad final |
| 14 | CTA Final | Conversión definitiva | Urgencia emocional |
| — | Footer | Cierre institucional | Credibilidad |

---

## DETALLE DE CADA SECCIÓN

---

### SECCIÓN 01 — HERO PRINCIPAL

**Rol en el embudo:** Captura emocional instantánea. El visitante decide quedarse o irse en los primeros 3 segundos.

**Objetivo:** Enamorar, conectar y llevar al primer CTA.

**Contenido:**

| Elemento | Texto / Descripción |
|---|---|
| **Eyebrow** | *"Decoración infantil personalizada · Surco, Lima"* |
| **H1** | *"La habitación que tu bebé merece, hecha solo para él"* |
| **Subheadline** | *"Nubes con luz, nombres decorativos y piezas únicas. 100% personalizadas, listas en 4 días hábiles y con envío a todo el Perú."* |
| **Slogan** | *"Ilusión hecha decoración ✨"* |
| **Visual hero** | Foto principal: nube con luz encendida en habitación de bebé, ambiente cálido y mágico |
| **Trust badges** | ☁️ Hecho a mano · ✨ 100% Personalizado · 📦 Envíos a todo el Perú · ⚡ Listo en 4 días |

**CTA principal:**
```
✨ Quiero mi decoración personalizada
→ Link: WhatsApp con mensaje "Hola! Quiero cotizar una decoración para la habitación de mi bebé 🌟"
```

**CTA secundario (debajo, más sutil):**
```
Ver productos → [scroll suave a sección categorías]
```

**Notas de diseño:**
- Fondo: gradiente crema → rosa pastel muy suave
- Decoración: nubes SVG flotando sutilmente, estrellas pequeñas
- En mobile: imagen hero arriba, texto y CTA abajo (stack vertical)
- Botón principal: dorado, grande (mínimo 56px alto en mobile), texto blanco

---

### SECCIÓN 02 — BENEFICIOS RÁPIDOS

**Rol en el embudo:** Validación inmediata. Justo después del hero, confirma que están en el lugar correcto.

**Objetivo:** Transmitir los 4 pilares de valor en menos de 10 segundos de lectura.

**Título de sección:** *"¿Por qué elegir SEGEDA HOME?"*

**Contenido — 4 tarjetas:**

| # | Ícono | Título | Descripción |
|---|---|---|---|
| 1 | ⭐ | **100% Personalizado** | Tu nombre, tus colores, tu temática. Cada pieza es única y creada especialmente para ti. |
| 2 | 📦 | **Envíos a Todo el Perú** | Desde Lima hasta donde estés. Llevamos la magia a cualquier rincón del país. |
| 3 | ⚡ | **Listo en 4 Días Hábiles** | Producción rápida sin sacrificar calidad. Tu decoración llega antes de lo que imaginas. |
| 4 | 💎 | **Materiales Premium** | MDF de calidad, vinil adhesivo, papel fotográfico glossy y luces LED. Piezas que duran. |

**Layout:** 4 tarjetas en fila (desktop) / 2x2 grid (mobile)
**Estilo:** Cards con fondo blanco, borde suave, sombra mínima, ícono grande arriba

**Sin CTA en esta sección** — el objetivo es solo reforzar, no interrumpir el flujo.

---

### SECCIÓN 03 — CATEGORÍAS Y PRECIOS

**Rol en el embudo:** Despertar el deseo concreto. El visitante identifica qué quiere comprar.

**Objetivo:** Mostrar todo el catálogo con nombres atractivos, precios claros y CTA directos por producto.

**Título de sección:** *"Nuestras Creaciones"*
**Subtítulo:** *"Cada pieza hecha a mano, con amor y atención al detalle"*

---

#### ORDEN RECOMENDADO DE CATEGORÍAS (de mayor a menor conversión esperada)

**Criterio de orden:** popularidad estimada, precio de entrada accesible, alto impacto visual.

| Posición | Categoría | Justificación |
|---|---|---|
| 1 | Nube con Nombre y Luz | Producto estrella: personalización + luz + precio medio. Máximo deseo. |
| 2 | Nube con Luz | Entrada más accesible (desde S/35). Atrae a mayor número de perfiles. |
| 3 | Placas Circulares con Luz | Alto impacto visual, precio premium, excelente para regalo. |
| 4 | Nube Temática con Luz | Para clientes con idea clara de temática. Mayor inversión. |
| 5 | Stickers de Estrellas | Complemento perfecto, precio bajo, fácil impulso de compra. |
| 6 | Nombres Decorativos | Sin foto definida aún, se muestra con descripción sólida. |
| 7 | Decoración Temática | Categoría amplia, se muestra como servicio personalizado. |
| 8 | Composiciones de Pared | Producto premium de mayor alcance, cierra el catálogo. |

---

#### FICHA COMERCIAL DE CADA CATEGORÍA

---

**CATEGORÍA 1**
```
Nombre comercial:   ✨ Nube con Nombre y Luz
Etiquetas:          [⭐ Más Pedida]  [💡 Con Luz LED]  [🎨 Personalizable]  [🎁 Ideal para Regalo]
Descripción:        La pieza más especial que puede tener la habitación de tu bebé.
                    Su nombre, brillando con luz cálida, en una nube suave y mágica.
                    Elige el tamaño, los colores y hazla completamente tuya.

Precios:
  ☁️ 30 cm .............. S/ 45
  ☁️ 40 cm .............. S/ 60
  ☁️ 50 cm .............. S/ 75   ← [Más elegido]
  ☁️ 60 cm .............. S/ 90
  ☁️ 70 cm .............. S/ 110
  ☁️ 80 cm .............. S/ 130

Incluye:            Nombre personalizado · Luz LED a pilas · Colores a elección
Nota:               Funciona con 2 pilas AA (no incluidas)

CTA:                💬 Quiero esta nube para mi bebé
Mensaje WA:         "Hola! Me interesa la Nube con Nombre y Luz 🌟 ¿me pueden dar más información?"
```

---

**CATEGORÍA 2**
```
Nombre comercial:   ☁️ Nube con Luz
Etiquetas:          [💡 Con Luz LED]  [🎨 Personalizable]  [✅ Desde S/35]
Descripción:        Sencilla, mágica y perfecta para cualquier estilo de habitación.
                    Una nube suave con luz cálida que transforma cualquier rincón
                    en un espacio de cuento. Elige el tamaño y el color que más te guste.

Precios:
  ☁️ 30 cm .............. S/ 35
  ☁️ 40 cm .............. S/ 45
  ☁️ 50 cm .............. S/ 60
  ☁️ 60 cm .............. S/ 75
  ☁️ 70 cm .............. S/ 90
  ☁️ 80 cm .............. S/ 100

Incluye:            Luz LED a pilas · Color personalizado
Nota:               Funciona con 2 pilas AA (no incluidas)

CTA:                💬 Quiero cotizar esta nube
Mensaje WA:         "Hola! Me interesa la Nube con Luz ☁️ ¿me pueden dar más información?"
```

---

**CATEGORÍA 3**
```
Nombre comercial:   🌟 Placa Circular con Luz
Etiquetas:          [⭐ Más Pedida]  [💡 Con Luz LED]  [🎨 Personalizable]  [🎁 Ideal para Regalo]
Descripción:        Elegante, luminosa y completamente personalizada.
                    Una placa circular con tu diseño y el nombre de tu bebé,
                    iluminada con luz LED cálida. El regalo perfecto para
                    un baby shower o cumpleaños inolvidable.

Precios:
  ⭕ 30 cm .............. S/ 80
  ⭕ 35 cm .............. S/ 95
  ⭕ 40 cm .............. S/ 110  ← [Más elegido]
  ⭕ 45 cm .............. S/ 130
  ⭕ 50 cm .............. S/ 150
  ⭕ 60 cm .............. S/ 180

Incluye:            Nombre personalizado · Diseño a elección · Luz LED a pilas
Nota:               Funciona con 2 pilas AA (no incluidas)

CTA:                💬 Quiero personalizar mi placa
Mensaje WA:         "Hola! Me interesa la Placa Circular con Luz 🌟 ¿me pueden dar más información?"
```

---

**CATEGORÍA 4**
```
Nombre comercial:   🎨 Nube Temática con Luz
Etiquetas:          [🎨 Diseño Exclusivo]  [💡 Con Luz LED]  [✨ 100% Personalizada]
Descripción:        ¿Tu bebé tiene una temática favorita? La hacemos realidad.
                    Princesas, dinosaurios, espacio, animales, arcoíris y más.
                    Una nube única con el diseño temático que tú imaginas,
                    con luz cálida y acabado premium.

Precios:
  ☁️ 40 cm .............. S/ 80
  ☁️ 50 cm .............. S/ 100
  ☁️ 60 cm .............. S/ 120
  ☁️ 70 cm .............. S/ 150
  ☁️ 80 cm .............. S/ 180

Incluye:            Diseño temático personalizado · Luz LED a pilas
Nota:               Coordina tu temática por WhatsApp antes de confirmar el pedido

CTA:                💬 Cuéntanos tu temática
Mensaje WA:         "Hola! Me interesa la Nube Temática con Luz 🎨 ¿me pueden ayudar con el diseño?"
```

---

**CATEGORÍA 5**
```
Nombre comercial:   ⭐ Pack de Estrellas Brillantes
Etiquetas:          [💛 Complemento Ideal]  [✅ Solo S/25]  [🛒 Agrega a tu pedido]
Descripción:        El toque final que hace la diferencia.
                    80 stickers de estrellas para decorar las paredes alrededor
                    de tu nube o placa. Pequeñas, brillantes y mágicas.
                    ¡Perfectas para completar el rincón de sueños de tu bebé!

Precio:             S/ 25 (pack de 80 stickers)

Incluye:            80 stickers de estrellas · Adhesivo incluido
Tip:                Se recomienda combinar con cualquier nube o placa

CTA:                💬 Agregar estrellas a mi pedido
Mensaje WA:         "Hola! Me interesan los Stickers de Estrellas ⭐ ¿puedo agregarlo a mi pedido?"
```

---

**CATEGORÍA 6**
```
Nombre comercial:   🔤 Nombres Decorativos
Etiquetas:          [🎨 Personalizable]  [✨ Hecho a Mano]  [🎁 Ideal para Regalo]
Descripción:        El nombre de tu bebé convertido en arte decorativo.
                    Letras personalizadas en MDF con los colores, tamaños
                    y estilos que elijas. Una decoración con identidad propia
                    que crece junto con tu hijo.

Precio:             Consultar por WhatsApp (varía según tamaño y número de letras)

CTA:                💬 Cotizar nombre decorativo
Mensaje WA:         "Hola! Me interesan los Nombres Decorativos ✨ ¿me pueden dar un precio?"
```

---

**CATEGORÍA 7**
```
Nombre comercial:   🦋 Decoración Temática Infantil
Etiquetas:          [🎨 Diseño Exclusivo]  [✨ 100% Personalizada]  [🎁 Ideal para Regalo]
Descripción:        Dale vida a cualquier temática que imagines.
                    Diseñamos piezas decorativas personalizadas basadas en
                    la temática favorita de tu bebé o niño: animales, espacio,
                    princesas, superhéroes, naturaleza y mucho más.

Precio:             Consultar por WhatsApp (varía según complejidad del diseño)

CTA:                💬 Quiero decoración temática
Mensaje WA:         "Hola! Me interesa la Decoración Temática 🦋 ¿pueden ayudarme con un diseño?"
```

---

**CATEGORÍA 8**
```
Nombre comercial:   🖼️ Composiciones Decorativas para Pared
Etiquetas:          [✨ Pieza Única]  [🎨 Diseño Exclusivo]  [💎 Acabado Premium]
Descripción:        Transforma una pared entera en una obra de arte.
                    Combinamos nubes, nombres, placas, marcos y elementos
                    decorativos en una composición armoniosa y personalizada.
                    El resultado más impactante para la habitación de tu bebé.

Precio:             Consultar por WhatsApp (proyecto a medida)

CTA:                💬 Diseñar mi composición
Mensaje WA:         "Hola! Me interesan las Composiciones para Pared 🖼️ ¿podemos conversar sobre el diseño?"
```

---

#### PRESENTACIÓN DE PRECIOS EN MOBILE

**Problema a resolver:** Las tablas de precios son difíciles de leer en pantallas pequeñas.

**Solución recomendada — "Selector de Tamaño" tipo pill/chip:**

```
Diseño visual (por categoría que tiene rangos de precios):

  Elige el tamaño:
  [30cm S/45] [40cm S/60] [50cm S/75★] [60cm S/90] [70cm S/110] [80cm S/130]

  - Pills horizontales con scroll si no caben
  - El tamaño "más elegido" marcado con ★ o badge visual
  - Color activo: dorado con texto blanco
  - Color inactivo: crema con texto marrón
  - Al tocar un pill, el precio resalta debajo: "Precio: S/75"
```

**Alternativa más simple (si no hay JS):**
```
  Lista compacta con separador de puntos:
  30cm S/45 · 40cm S/60 · 50cm S/75 · 60cm S/90 · 70cm S/110 · 80cm S/130
  
  En una sola línea con overflow-x: auto o salto de línea controlado.
  Tamaño más pedido en negrita o con icono ★
```

**Regla de precio mínimo visible:**
- Siempre mostrar *"Desde S/XX"* en el encabezado de la tarjeta
- Esto reduce la fricción: el visitante sabe de entrada si está en su rango de presupuesto

---

#### SISTEMA DE ETIQUETAS COMERCIALES

| Etiqueta | Color | Uso |
|---|---|---|
| ⭐ **Más Pedida** | Dorado sobre crema | Nube con Nombre y Luz, Placa Circular |
| 💡 **Con Luz LED** | Amarillo suave | Todas las nubes y placas con luz |
| 🎨 **Personalizable** | Rosa pastel | Todas las categorías |
| 🎁 **Ideal para Regalo** | Verde salvia | Nube con Nombre, Placa Circular, Nombres Decorativos |
| ✅ **Desde S/35** | Verde suave | Nube con Luz (precio de entrada más bajo) |
| ✅ **Solo S/25** | Verde suave | Stickers de Estrellas |
| ✨ **100% Personalizada** | Crema dorado | Nube Temática, Decoración Temática, Composiciones |
| 💎 **Acabado Premium** | Marrón cálido | Composiciones de Pared |
| 💛 **Complemento Ideal** | Amarillo | Stickers de Estrellas |
| 🛒 **Agrega a tu pedido** | Rosa | Stickers de Estrellas |
| 🎨 **Diseño Exclusivo** | Lila suave | Nube Temática, Decoración Temática |

**Regla de etiquetas:** máximo 3 etiquetas por tarjeta de producto.

---

#### BOTONES CTA POR CATEGORÍA

Todas las categorías tienen botón directo a WhatsApp con mensaje pre-llenado específico.

| Categoría | Tiene CTA WhatsApp | Mensaje pre-llenado |
|---|---|---|
| Nube con Nombre y Luz | ✅ Sí | "Me interesa la Nube con Nombre y Luz 🌟" |
| Nube con Luz | ✅ Sí | "Me interesa la Nube con Luz ☁️" |
| Placa Circular con Luz | ✅ Sí | "Me interesa la Placa Circular con Luz 🌟" |
| Nube Temática con Luz | ✅ Sí | "Me interesa la Nube Temática 🎨" |
| Stickers de Estrellas | ✅ Sí | "Quiero los Stickers de Estrellas ⭐" |
| Nombres Decorativos | ✅ Sí | "Me interesan los Nombres Decorativos ✨" |
| Decoración Temática | ✅ Sí | "Me interesa la Decoración Temática 🦋" |
| Composiciones de Pared | ✅ Sí | "Me interesan las Composiciones para Pared 🖼️" |

**Texto del botón:** `💬 Consultar precio` (para las que tienen precio fijo)  
**Texto del botón:** `💬 Cotizar por WhatsApp` (para las que son a consultar)

---


### SECCIÓN 04 — GALERÍA DE TRABAJOS REALES

**Rol en el embudo:** Prueba social visual. Ver = creer. Es la sección que más convierte después del hero.

**Objetivo:** Demostrar calidad, variedad y resultados reales antes de pedir el precio.

**Título de sección:** *"Ilusiones que ya hicimos realidad"*
**Subtítulo:** *"Cada foto es un bebé feliz y una mamá emocionada"*

**Contenido:**
- Mosaico de 6 a 9 fotos reales de productos terminados
- Prioridad visual: fotos con luz encendida, habitaciones completas, close-up de materiales
- Pie de galería: *"📸 ¿Te imaginas algo así para tu bebé?"*

**CTA al pie de la galería:**
```
✨ Ver más en Instagram → @Segedahomel
```

**Layout:**
- Mobile: grid 2 columnas, fotos cuadradas
- Desktop: grid 3 columnas tipo masonry o uniforme
- Hover: leve zoom + overlay con categoría del producto

**Notas:**
- En Fase 1 usar placeholders estéticos con colores de marca
- En Fase 2 reemplazar con fotos reales del negocio
- Las fotos deben estar optimizadas en WebP y con lazy loading

---

### SECCIÓN 05 — TESTIMONIOS DE CLIENTES

**Rol en el embudo:** Prueba social textual. Transforma el deseo en confianza.

**Objetivo:** Que el visitante se identifique con otro cliente real y pierda el miedo a comprar por WhatsApp.

**Título de sección:** *"Lo que dicen las mamás que ya confiaron en nosotras 💛"*

**Estructura de cada testimonio:**
```
[Foto del producto recibido (si disponible) o avatar genérico]
"Quote del cliente: máximo 2-3 oraciones. Enfocado en la experiencia, 
 la calidad o cómo quedó la habitación."
— Nombre (sin apellido), Ciudad
⭐⭐⭐⭐⭐
```

**Testimonios sugeridos (placeholders para Fase 1, reemplazar con reales):**

> *"Quedé súper contenta con la nube de Valentina. Los colores exactamente como los pedí y llegó súper bien empacada. ¡Repetiré seguro!"*
> — Claudia M., Lima ⭐⭐⭐⭐⭐

> *"El proceso fue muy fácil, me mandaron el diseño antes de hacerlo y quedó hermoso. La placa circular con el nombre de mi hijo es lo más lindo de su cuarto."*
> — Paola R., Arequipa ⭐⭐⭐⭐⭐

> *"Llegó en menos tiempo del que esperaba y el acabado es de muy buena calidad. Lo recomiendo a todas las mamás."*
> — Daniela T., Trujillo ⭐⭐⭐⭐⭐

**Badge de confianza:**
```
💛 Más de [X] familias felices en todo el Perú
```

**Layout:**
- Mobile: cards apiladas, una visible con scroll horizontal (tipo carrusel)
- Desktop: 3 cards en fila

---

### SECCIÓN 06 — PERSONALIZACIÓN

**Rol en el embudo:** Conectar con la visión personal del cliente. Hace que el producto pase de "genérico" a "mío".

**Objetivo:** Mostrar de forma visual y atractiva qué se puede personalizar y que el proceso es fácil.

**Título de sección:** *"Hecho exactamente como lo imaginas"*
**Subtítulo:** *"Tú decides, nosotras creamos."*

**Contenido — 4 variables de personalización:**

| Variable | Ícono | Descripción |
|---|---|---|
| **Nombre** | 🔤 | El nombre de tu bebé o niño, exactamente como quieras escribirlo |
| **Tamaño** | 📐 | Desde 30 cm hasta 80 cm, según el espacio de tu habitación |
| **Colores** | 🎨 | Paleta libre: dinos tus colores favoritos o los de la temática del cuarto |
| **Temática** | 🦋 | Princesas, dinosaurios, espacio, animales, arcoíris, minimalista y más |

**Mensaje principal:**
*"¿Tienes una idea en mente? ¡Cuéntanos! También puedes elegir entre nuestros modelos existentes o crear algo completamente nuevo desde cero."*

**CTA:**
```
💬 Empezar mi personalización
→ Mensaje WA: "Hola! Quiero personalizar una decoración para el cuarto de mi bebé. Mi idea es: [el cliente completa]"
```

---

### SECCIÓN 07 — CÓMO COMPRAR

**Rol en el embudo:** Eliminar el miedo al proceso. Muchos clientes abandonan porque no saben qué pasará después de escribir.

**Objetivo:** Hacer que el proceso de compra se vea simple, seguro y humano.

**Título de sección:** *"Pedir es muy fácil"*
**Subtítulo:** *"En 4 pasos, tu decoración estará en camino 🚀"*

**Contenido — timeline de 4 pasos:**

| Paso | Ícono | Título | Descripción |
|---|---|---|---|
| 1 | 💬 | **Escríbenos** | Cuéntanos qué quieres por WhatsApp. Nombre, tamaño, colores, temática. Sin complicaciones. |
| 2 | ✏️ | **Te enviamos el diseño** | Antes de producir, te mostramos cómo quedará. Tú apruebas y nosotras empezamos. |
| 3 | 🔨 | **Producimos tu pedido** | Elaboramos tu pieza con materiales premium. Listo en 4 días hábiles tras el adelanto. |
| 4 | 📦 | **Lo recibes en casa** | Envío a todo el Perú o recojo en Surco, Lima. Tu decoración llega segura y bien empacada. |

**Nota importante (visible, no intimidante):**
```
💡 Recuerda: para iniciar la producción se requiere un adelanto del 50% del total.
   Es nuestra garantía de que tu pedido queda reservado y en producción.
```

**CTA:**
```
💬 Comenzar ahora
→ Link WhatsApp global
```

**Layout:**
- Mobile: timeline vertical, pasos apilados
- Desktop: timeline horizontal con línea conectora entre pasos

---

### SECCIÓN 08 — MATERIALES Y CALIDAD

**Rol en el embudo:** Justificar el precio. El cliente necesita entender por qué vale lo que vale.

**Objetivo:** Generar percepción de calidad y durabilidad sin usar términos técnicos fríos.

**Título de sección:** *"Hecho para durar, diseñado para brillar"*
**Subtítulo:** *"Cada pieza se elabora con materiales cuidadosamente seleccionados"*

**Contenido — lista de materiales con descripción amigable:**

| Material | Descripción vendedora |
|---|---|
| 🪵 **MDF de calidad** | Base sólida y resistente que da forma a cada pieza con precisión y durabilidad |
| 🎨 **Vinil adhesivo** | Colores vivos y adherencia perfecta. Da vida a los diseños con nitidez y detalle |
| 📸 **Papel fotográfico ultra premium glossy** | El brillo y la calidad de una fotografía profesional en cada diseño |
| 🛡️ **Laminado frío** | Protección extra que hace que los colores duren más y sean fáciles de limpiar |
| 💡 **Luces LED a pilas** | Luz cálida, segura para bebés y sin necesidad de enchufes. Funciona con 2 pilas AA |

**Visual sugerido:**
- Iconografía suave para cada material
- Fondo verde salvia muy suave o crema

**Sin CTA en esta sección** — es una sección de credibilidad, no de acción.

---

### SECCIÓN 09 — PAGOS Y ADELANTO DEL 50%

**Rol en el embudo:** Resolver la objeción más frecuente: *"¿Es seguro pagar por adelantado?"*

**Objetivo:** Hacer que el adelanto del 50% se vea como algo natural, justo y protector para ambas partes.

**Título de sección:** *"Pago fácil y proceso transparente"*

**Contenido:**

**Bloque 1 — Métodos de pago:**
```
Aceptamos:
  💚 Yape
  💜 Plin
  🏦 Transferencia bancaria
  💵 Efectivo (solo si recoges en Surco)
```

**Bloque 2 — El adelanto del 50%:**
```
¿Cómo funciona el adelanto?

Para confirmar y reservar tu pedido, solicitamos el 50% del total como adelanto.
El 50% restante se paga antes de la entrega o envío.

Sin adelanto no se inicia la elaboración — esto garantiza que tu pedido
quede reservado y en producción exclusivamente para ti.
```

**Tono del copy:**
- Explicar el adelanto como algo que protege al cliente también (su pedido queda reservado)
- Evitar frases que suenen a advertencia o prohibición
- Acompañar con ícono de seguridad o escudo

**Etiqueta de confianza:**
```
🔒 Tu pedido seguro. Tu decoración, en camino.
```

**CTA:**
```
💬 Tengo dudas sobre el pago
→ Mensaje WA: "Hola! Tengo una consulta sobre los métodos de pago 💳"
```

---

### SECCIÓN 10 — ENVÍOS A TODO EL PERÚ

**Rol en el embudo:** Eliminar la barrera geográfica. Muchos clientes de provincia dudan si el negocio les vende.

**Objetivo:** Confirmar con fuerza que llegan a cualquier parte del país.

**Título de sección:** *"Llevamos la magia a donde estés"*
**Subtítulo:** *"📦 Enviamos a todo el Perú"*

**Contenido:**

| Elemento | Descripción |
|---|---|
| **Mapa visual** | Mapa de Perú con puntos o silueta con el texto "Envíos nacionales" |
| **Cobertura** | *"Desde Lima hasta Iquitos, Cusco, Arequipa, Trujillo y más. Si estás en Perú, llegamos."* |
| **Recojo en tienda** | *"¿Estás en Lima? También puedes recoger tu pedido en Surco sin costo de envío."* |
| **Empaque** | *"Cada producto sale protegido para que llegue perfecto a tus manos."* |
| **Tiempo total** | *"4 días hábiles de producción + tiempo de envío según tu ciudad."* |

**CTA:**
```
💬 Consultar envío a mi ciudad
→ Mensaje WA: "Hola! Quiero saber el costo de envío a [ciudad] 📦"
```

---

### SECCIÓN 11 — CUIDADOS DEL PRODUCTO

**Rol en el embudo:** Refuerza la percepción de calidad post-compra y reduce las quejas o devoluciones.

**Objetivo:** Educar al cliente de forma amigable, transmitir durabilidad y responsabilidad de la marca.

**Título de sección:** *"Para que siempre brille como el primer día ✨"*

**Contenido — 3 reglas de cuidado:**

| # | Ícono | Regla | Descripción |
|---|---|---|---|
| ✅ | 🧴 | **Limpia con alcohol isopropílico** | Una gota en un paño suave es todo lo que necesitas para mantenerla impecable |
| ❌ | 🚫 | **No golpear** | Las piezas están hechas con MDF de calidad, pero hay que tratarlas con cariño |
| ❌ | 🖌️ | **No pintar** | El acabado premium ya está listo. Agregar pintura daña el diseño original |

**Tono:** amigable y cálido, como un consejo de amiga, no como una advertencia legal.

**Sin CTA en esta sección.**

---

### SECCIÓN 12 — REDES SOCIALES

**Rol en el embudo:** Extender la relación más allá de la landing. El cliente que sigue en redes puede convertir después.

**Objetivo:** Invitar a seguir en Instagram y Facebook con un copy atractivo.

**Título de sección:** *"Síguenos y llénate de inspiración 🌟"*
**Subtítulo:** *"Cada día subimos nuevas creaciones, ideas y diseños exclusivos"*

**Contenido:**

| Red | Handle | CTA |
|---|---|---|
| 📸 Instagram | @Segedahomel | *"Ver galería en Instagram"* |
| 👍 Facebook | Segeda Home | *"Seguirnos en Facebook"* |

**Elemento visual sugerido:**
- Mini feed de Instagram (3-6 últimas fotos) si hay integración
- Alternativa: 3 fotos estáticas de productos con link al Instagram real
- Background: rosa pastel muy suave

**CTA principal:**
```
📸 Ver más en @Segedahomel
→ Link: https://www.instagram.com/Segedahomel
```

---

### SECCIÓN 13 — PREGUNTAS FRECUENTES (FAQ)

**Rol en el embudo:** Resolver las últimas objeciones antes de la decisión final. Es el "pre-cierre" de la página.

**Objetivo:** Anticipar y responder las dudas que impiden que el cliente escriba por WhatsApp.

**Título de sección:** *"Resolvemos tus dudas"*

**Preguntas y respuestas:**

---

**P1: ¿Cómo hago mi pedido?**
*"Es muy fácil. Escríbenos por WhatsApp, cuéntanos qué quieres (nombre, tamaño, colores, temática) y te guiamos paso a paso. Antes de producir, te enviamos el diseño para que lo apruebes."*

---

**P2: ¿Por qué debo pagar el 50% por adelantado?**
*"El adelanto del 50% confirma y reserva tu pedido. Sin él no podemos iniciar la producción, ya que cada pieza se hace especialmente para ti. El saldo restante se paga antes de la entrega o el envío."*

---

**P3: ¿En cuánto tiempo está listo mi pedido?**
*"El tiempo de producción es de 4 días hábiles a partir de la confirmación del adelanto. A eso debes sumar el tiempo de envío según tu ciudad."*

---

**P4: ¿Hacen envíos a provincias?**
*"Sí, enviamos a todo el Perú. Cada pedido sale bien protegido para que llegue en perfectas condiciones. Consúltanos el costo de envío a tu ciudad por WhatsApp."*

---

**P5: ¿Puedo elegir los colores y el diseño?**
*"Absolutamente. Todos nuestros productos son 100% personalizables. Puedes elegir colores, tamaño, nombre y temática. Si tienes una idea específica, cuéntanosla — si tenemos modelos que te gusten, también puedes elegir uno de ellos."*

---

**P6: ¿Qué métodos de pago aceptan?**
*"Aceptamos Yape, Plin, transferencia bancaria y efectivo (solo si recoges en Surco, Lima)."*

---

**P7: ¿Puedo ver el diseño antes de que lo produzcan?**
*"Sí. Antes de iniciar la producción te enviamos el diseño por WhatsApp para que lo revises y apruebes. Queremos que quede exactamente como lo imaginaste."*

---

**P8: ¿Cómo cuido mi decoración?**
*"Limpia únicamente con un paño suave y alcohol isopropílico. Evita golpes y no pintes sobre el letrero para conservar el acabado original."*

---

**P9: ¿Las luces son seguras para bebés?**
*"Sí. Todas nuestras piezas con luz usan LEDs a pilas (2 pilas AA). No necesitan enchufes, no generan calor y son completamente seguras para el cuarto de tu bebé."*

---

**P10: ¿Puedo recoger mi pedido en Lima?**
*"Claro que sí. Si estás en Lima puedes recoger tu pedido en Surco sin costo de envío. Coordínamos la entrega por WhatsApp."*

---

**Layout:** Accordion colapsable — solo se ve la pregunta, se expande al tocar.
**Nota:** Las preguntas más importantes (P1, P2, P3) deben estar abiertas por defecto o primeras en la lista.

---

### SECCIÓN 14 — CTA FINAL

**Rol en el embudo:** Conversión definitiva. Es la última oportunidad de la página para que el cliente actúe.

**Objetivo:** Generar urgencia emocional, no urgencia artificial. Apelar al bebé, no al descuento.

**Fondo:** Gradiente dorado suave o rosa pastel con elementos decorativos (nubes, estrellas, brillos)

**Título principal:**
```
"Dale a tu bebé el cuarto que merece 💛"
```

**Subtítulo:**
```
"Cada pieza es única, hecha con amor y lista en 4 días hábiles.
 Escríbenos hoy y empieza a imaginar."
```

**CTA principal (botón grande, dorado, texto blanco):**
```
✨ Quiero mi decoración ahora
→ Link WhatsApp: "Hola SEGEDA HOME! Quiero empezar con mi decoración personalizada 🌟 ¿me pueden ayudar?"
```

**CTA secundario (texto link, más sutil):**
```
📸 Ver más inspiración en Instagram → @Segedahomel
```

**Info rápida debajo del botón:**
```
📍 Surco, Lima · 📦 Envíos a todo el Perú · ⚡ 4 días hábiles
```

**Métodos de pago (íconos pequeños):**
```
Aceptamos: 💚 Yape  💜 Plin  🏦 Transferencia  💵 Efectivo
```

---

### FOOTER

**Rol:** Cierre institucional y accesos de servicio.

**Contenido:**

```
[Logo SEGEDA HOME]
"Ilusión hecha decoración"

📱 WhatsApp: 978 642 447
📸 Instagram: @Segedahomel
👍 Facebook: Segeda Home
📍 Surco, Lima, Perú

© 2026 SEGEDA HOME · Todos los derechos reservados
[Política de privacidad] (Fase 2)
```

---

## RESUMEN — FLUJO COMPLETO DE CONVERSIÓN

```
[NAVBAR] → Botón WhatsApp siempre visible
     ↓
[01. HERO] → Emoción + CTA inmediato
     ↓
[02. BENEFICIOS] → Confirmación de la decisión
     ↓
[03. CATEGORÍAS Y PRECIOS] → Deseo específico + CTA por producto ←── Mayor conversión
     ↓
[04. GALERÍA] → Confianza visual + link Instagram
     ↓
[05. TESTIMONIOS] → Confianza social + identificación
     ↓
[06. PERSONALIZACIÓN] → Proyección personal
     ↓
[07. CÓMO COMPRAR] → Claridad del proceso
     ↓
[08. MATERIALES] → Justificación del precio
     ↓
[09. PAGOS] → Resolución objeción adelanto
     ↓
[10. ENVÍOS] → Resolución objeción geográfica
     ↓
[11. CUIDADOS] → Confianza post-compra
     ↓
[12. REDES] → Extensión de la relación
     ↓
[13. FAQ] → Eliminación de últimas objeciones
     ↓
[14. CTA FINAL] → Conversión definitiva ←── Segundo mayor punto de conversión
     ↓
[FOOTER] → Accesos de servicio

[FLOTANTE] → Botón WhatsApp permanente en mobile
```

---

*Documento generado como parte del plan estratégico de SEGEDA HOME · Mayo 2026*
*Próximo paso: Implementación Fase 1 — Código HTML + CSS de la landing page*
