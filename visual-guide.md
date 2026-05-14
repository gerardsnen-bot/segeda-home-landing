# GUÍA VISUAL — SEGEDA HOME
> **Versión:** 1.0 | **Fecha:** Mayo 2026
> **Documento:** Sistema de diseño visual para la landing page. Paleta, tipografía, componentes y responsive.

---

## FILOSOFÍA DE DISEÑO

SEGEDA HOME es una marca **boutique**. No una tienda genérica de decoración, sino un taller artesanal de ilusiones. El diseño debe transmitir:

- **Ternura** sin caer en infantilismo barato
- **Elegancia** sin perder calidez
- **Magia** sin perder profesionalismo
- **Confianza** sin parecer corporativo

**Referentes visuales:** Pinterest nursery rooms · tiendas de papelería premium · marcas de ropa infantil boutique · ilustración acuarela contemporánea.

---

## 1. PALETA DE COLORES

### Colores principales

| Nombre | HEX | RGB | Uso principal |
|---|---|---|---|
| **Crema marfil** | `#FDF6EC` | 253, 246, 236 | Fondo general de la página |
| **Rosa pastel** | `#F7C5D0` | 247, 197, 208 | Color principal de marca, fondos de sección |
| **Verde salvia** | `#A8C5A0` | 168, 197, 160 | Color secundario, badges, acentos naturales |
| **Dorado suave** | `#C9963A` | 201, 150, 58 | CTAs principales, detalles premium, precios |
| **Marrón chocolate** | `#4A2C1A` | 74, 44, 26 | Texto principal, títulos oscuros |

### Colores secundarios

| Nombre | HEX | RGB | Uso |
|---|---|---|---|
| **Gris taupe cálido** | `#8C7B72` | 140, 123, 114 | Texto secundario, subtítulos, placeholders |
| **Lila claro** | `#DDD0F0` | 221, 208, 240 | Fondo secciones alternadas, tarjetas |
| **Celeste bebé** | `#C8E6F5` | 200, 230, 245 | Fondos suaves, badges azules |
| **Amarillo miel** | `#F5E0A0` | 245, 224, 160 | Badge "Más Pedida", estrellas |

### Colores de estado / UI

| Nombre | HEX | Uso |
|---|---|---|
| **Blanco cálido** | `#FFFDF9` | Fondos de cards, modales |
| **Sombra suave** | `rgba(74,44,26,0.08)` | Box-shadow en cards y botones |
| **Overlay dark** | `rgba(74,44,26,0.45)` | Overlay en fotos de galería |
| **Verde WhatsApp** | `#25D366` | Botón flotante WhatsApp |
| **Verde WhatsApp hover** | `#1DA851` | Hover del botón WhatsApp |

### Degradados de marca

```css
/* Degradado hero principal */
background: linear-gradient(160deg, #FDF6EC 0%, #F7C5D0 60%, #DDD0F0 100%);

/* Degradado CTA final */
background: linear-gradient(135deg, #F7C5D0 0%, #FDF6EC 50%, #DDD0F0 100%);

/* Degradado navbar al hacer scroll */
background: linear-gradient(to bottom, #FDF6EC, rgba(253,246,236,0.97));

/* Degradado dorado premium (botones) */
background: linear-gradient(135deg, #D4A84B 0%, #C9963A 100%);
```

---

## 2. TIPOGRAFÍAS

### Familia tipográfica

| Rol | Fuente | Peso | Uso |
|---|---|---|---|
| **Display / Títulos grandes** | `Cormorant Garamond` | 400, 600, 700 | H1, titulares hero, slogan |
| **Títulos de sección** | `Playfair Display` | 500, 700 | H2, H3 de secciones |
| **Cuerpo / UI** | `Nunito` | 400, 500, 600, 700 | Párrafos, labels, botones, nav |
| **Acento / Slogan** | `Dancing Script` | 400, 700 | Slogan "Ilusión hecha decoración", detalles especiales |

### Google Fonts — Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Dancing+Script:wght@400;700&family=Nunito:wght@400;500;600;700&family=Playfair+Display:wght@500;700&display=swap" rel="stylesheet">
```

### Escala tipográfica (mobile-first)

```css
/* Variables CSS */
--font-display:    'Cormorant Garamond', Georgia, serif;
--font-heading:    'Playfair Display', Georgia, serif;
--font-body:       'Nunito', system-ui, sans-serif;
--font-accent:     'Dancing Script', cursive;

/* Tamaños mobile */
--text-xs:    0.75rem;   /* 12px — etiquetas, notas */
--text-sm:    0.875rem;  /* 14px — textos secundarios */
--text-base:  1rem;      /* 16px — cuerpo de texto */
--text-lg:    1.125rem;  /* 18px — subtítulos */
--text-xl:    1.25rem;   /* 20px — títulos pequeños */
--text-2xl:   1.5rem;    /* 24px — H3 secciones */
--text-3xl:   1.875rem;  /* 30px — H2 secciones */
--text-4xl:   2.25rem;   /* 36px — H1 mobile */
--text-5xl:   3rem;      /* 48px — H1 desktop */
--text-6xl:   3.75rem;   /* 60px — Hero display desktop */

/* Altura de línea */
--leading-tight:   1.2;
--leading-snug:    1.35;
--leading-normal:  1.6;
--leading-relaxed: 1.75;
```

### Aplicación tipográfica por elemento

| Elemento | Fuente | Tamaño mobile | Tamaño desktop | Peso | Color |
|---|---|---|---|---|---|
| H1 Hero | Cormorant Garamond | 2.5rem | 4rem | 700 | `#4A2C1A` |
| Slogan | Dancing Script | 1.25rem | 1.5rem | 700 | `#C9963A` |
| Eyebrow | Nunito | 0.8rem | 0.875rem | 600 | `#8C7B72` uppercase |
| H2 Sección | Playfair Display | 1.75rem | 2.5rem | 700 | `#4A2C1A` |
| H3 Tarjeta | Playfair Display | 1.125rem | 1.25rem | 700 | `#4A2C1A` |
| Subtítulo sección | Nunito | 1rem | 1.125rem | 400 | `#8C7B72` |
| Párrafo / body | Nunito | 0.9375rem | 1rem | 400 | `#5C3D2E` |
| Precio principal | Cormorant Garamond | 1.5rem | 1.75rem | 700 | `#C9963A` |
| Precio "Desde" | Nunito | 0.8rem | 0.875rem | 600 | `#8C7B72` |
| Botón texto | Nunito | 0.9375rem | 1rem | 700 | `#FFFDF9` |
| Badge / etiqueta | Nunito | 0.7rem | 0.75rem | 700 | Varía |
| FAQ pregunta | Nunito | 0.9375rem | 1rem | 600 | `#4A2C1A` |
| FAQ respuesta | Nunito | 0.875rem | 0.9375rem | 400 | `#5C3D2E` |
| Footer texto | Nunito | 0.8rem | 0.875rem | 400 | `#8C7B72` |


---

## 3. ESTILO DE BOTONES

### Variables base

```css
--btn-radius:       50px;          /* bordes completamente redondeados */
--btn-padding-sm:   0.5rem 1.25rem;
--btn-padding-md:   0.75rem 1.75rem;
--btn-padding-lg:   1rem 2.25rem;
--btn-min-height:   48px;          /* mínimo táctil mobile */
--btn-font:         var(--font-body);
--btn-font-weight:  700;
--btn-transition:   all 0.25s ease;
--btn-shadow:       0 4px 16px rgba(201,150,58,0.30);
--btn-shadow-hover: 0 6px 24px rgba(201,150,58,0.45);
```

### Botón Primario — Dorado (CTA principal)

```css
.btn-primary {
  background: linear-gradient(135deg, #D4A84B 0%, #C9963A 100%);
  color: #FFFDF9;
  border: none;
  border-radius: var(--btn-radius);
  padding: var(--btn-padding-lg);
  min-height: var(--btn-min-height);
  font-family: var(--btn-font);
  font-weight: var(--btn-font-weight);
  font-size: 1rem;
  box-shadow: var(--btn-shadow);
  cursor: pointer;
  transition: var(--btn-transition);
  letter-spacing: 0.02em;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--btn-shadow-hover);
  background: linear-gradient(135deg, #E0B452 0%, #D4A84B 100%);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--btn-shadow);
}
```

**Aspecto visual:**
- Fondo: degradado dorado cálido
- Texto: blanco cálido `#FFFDF9`
- Sombra: dorado suave difuminado
- Hover: sube 2px + sombra más intensa
- Bordes: completamente redondeados (pill)

---

### Botón Secundario — Outline rosa

```css
.btn-secondary {
  background: transparent;
  color: #C9963A;
  border: 2px solid #C9963A;
  border-radius: var(--btn-radius);
  padding: calc(var(--btn-padding-lg));
  min-height: var(--btn-min-height);
  font-family: var(--btn-font);
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: var(--btn-transition);
}

.btn-secondary:hover {
  background: #C9963A;
  color: #FFFDF9;
  transform: translateY(-1px);
}
```

---

### Botón WhatsApp — Verde

```css
.btn-whatsapp {
  background: #25D366;
  color: #ffffff;
  border: none;
  border-radius: var(--btn-radius);
  padding: var(--btn-padding-lg);
  min-height: var(--btn-min-height);
  font-family: var(--btn-font);
  font-weight: 700;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 16px rgba(37,211,102,0.35);
  cursor: pointer;
  transition: var(--btn-transition);
}

.btn-whatsapp:hover {
  background: #1DA851;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37,211,102,0.45);
}
```

---

### Botón Flotante WhatsApp (fixed)

```css
.btn-whatsapp-float {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  background: #25D366;
  color: #ffffff;
  border: none;
  border-radius: 50px;
  padding: 0.875rem 1.5rem;
  font-family: var(--btn-font);
  font-weight: 700;
  font-size: 0.9375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 20px rgba(37,211,102,0.5);
  cursor: pointer;
  animation: pulse-whatsapp 4s infinite;
}

@keyframes pulse-whatsapp {
  0%, 90%, 100% { box-shadow: 0 4px 20px rgba(37,211,102,0.5); }
  95% { box-shadow: 0 4px 32px rgba(37,211,102,0.75), 0 0 0 8px rgba(37,211,102,0.15); }
}
```

---

### Botón de producto (tarjeta)

```css
.btn-card {
  background: transparent;
  color: #C9963A;
  border: 1.5px solid #C9963A;
  border-radius: var(--btn-radius);
  padding: 0.625rem 1.25rem;
  min-height: 42px;
  font-family: var(--btn-font);
  font-weight: 600;
  font-size: 0.875rem;
  width: 100%;
  cursor: pointer;
  transition: var(--btn-transition);
}

.btn-card:hover {
  background: #C9963A;
  color: #FFFDF9;
}
```

---

## 4. ESTILO DE CARDS DE PRODUCTO

### Estructura de la card

```
┌─────────────────────────────────┐
│  [Imagen del producto]          │ ← aspect-ratio 4/3 o cuadrado
│                                 │
│  [Badge "⭐ Más Pedida"]        │ ← posición absolute top-left
├─────────────────────────────────┤
│  [Etiquetas: 💡 LED · 🎨 Pers] │
│  [Nombre del producto]          │ ← Playfair Display, 700
│  [Descripción breve]            │ ← Nunito, 400, taupe
│                                 │
│  [Desde S/ XX]                  │ ← Nunito small + Cormorant precio
│  [Selector de tamaño (pills)]   │ ← scroll horizontal
│                                 │
│  [💬 Botón CTA]                 │ ← btn-card, full width
└─────────────────────────────────┘
```

### CSS de la card

```css
.product-card {
  background: #FFFDF9;
  border-radius: 20px;
  box-shadow: 0 2px 16px rgba(74,44,26,0.07);
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border: 1px solid rgba(247,197,208,0.4);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(74,44,26,0.12);
}

.product-card__image {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  background: linear-gradient(135deg, #F7C5D0, #DDD0F0);
}

.product-card__body {
  padding: 1.25rem;
}

.product-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
}

.product-card__name {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 700;
  color: #4A2C1A;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.product-card__desc {
  font-size: 0.875rem;
  color: #8C7B72;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.product-card__from {
  font-size: 0.75rem;
  color: #8C7B72;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.product-card__price {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
  color: #C9963A;
  line-height: 1;
  margin-bottom: 1rem;
}
```

### Badges / etiquetas

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.4;
}

/* Variantes */
.badge--gold    { background: #F5E0A0; color: #8A6200; }  /* Más Pedida */
.badge--rose    { background: #F7C5D0; color: #8B3A52; }  /* Personalizable */
.badge--green   { background: #D4EDD0; color: #2E6B2A; }  /* Envíos, Regalo */
.badge--yellow  { background: #FEF3C7; color: #92600A; }  /* Con Luz LED */
.badge--lilac   { background: #DDD0F0; color: #5B3D8A; }  /* Diseño Exclusivo */
.badge--sky     { background: #C8E6F5; color: #1A5C7A; }  /* Premium */
```

### Selector de tamaño (pills de precio)

```css
.size-pills {
  display: flex;
  gap: 0.375rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: none;
  margin-bottom: 1rem;
}

.size-pills::-webkit-scrollbar { display: none; }

.size-pill {
  flex-shrink: 0;
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  border: 1.5px solid #F7C5D0;
  background: #FDF6EC;
  color: #4A2C1A;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.size-pill:hover,
.size-pill.active {
  background: #C9963A;
  border-color: #C9963A;
  color: #FFFDF9;
}

.size-pill.popular::after {
  content: " ★";
  color: inherit;
}
```


---

## 5. ESTILO DE GALERÍA

### Layout

```css
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);   /* mobile: 2 columnas */
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr); /* tablet+: 3 columnas */
    gap: 1rem;
  }
}

@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr); /* desktop: mantener 3, pero más grande */
    gap: 1.25rem;
  }
}
```

### Ítem de galería

```css
.gallery-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 1;
  cursor: pointer;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.gallery-item__overlay {
  position: absolute;
  inset: 0;
  background: rgba(74,44,26,0.0);
  display: flex;
  align-items: flex-end;
  padding: 0.75rem;
  transition: background 0.3s ease;
}

.gallery-item:hover .gallery-item__overlay {
  background: rgba(74,44,26,0.40);
}

.gallery-item__label {
  color: #FFFDF9;
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0;
  transform: translateY(4px);
  transition: all 0.3s ease;
}

.gallery-item:hover .gallery-item__label {
  opacity: 1;
  transform: translateY(0);
}
```

### Placeholder de galería (Fase 1 sin fotos)

```css
.gallery-placeholder {
  background: linear-gradient(135deg, #F7C5D0 0%, #DDD0F0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8B3A52;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  gap: 0.5rem;
  border-radius: 16px;
  aspect-ratio: 1;
}
```

---

## 6. ESTILO DEL HERO

### Layout hero (mobile-first)

```
Mobile:
┌────────────────────────┐
│  [imagen / visual]     │ ← 50vh, object-fit cover con degradado encima
├────────────────────────┤
│  [eyebrow text]        │
│  [H1]                  │
│  [subtítulo]           │
│  [slogan Dancing Scr.] │
│  [trust badges row]    │
│  [CTA primario]        │
│  [CTA secundario link] │
└────────────────────────┘

Desktop:
┌────────────────────────────────────────────┐
│  [texto izq. 50%]  │  [imagen der. 50%]    │
│  eyebrow           │                       │
│  H1                │  [foto o mockup]      │
│  subtítulo         │                       │
│  slogan            │                       │
│  trust badges      │                       │
│  CTAs              │                       │
└────────────────────────────────────────────┘
```

### CSS del hero

```css
.hero {
  min-height: 100svh;
  background: linear-gradient(160deg, #FDF6EC 0%, #F7C5D0 55%, #DDD0F0 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 6rem 1.25rem 3rem; /* top padding por navbar */
}

@media (min-width: 1024px) {
  .hero {
    flex-direction: row;
    align-items: center;
    padding: 7rem 4rem 4rem;
    gap: 3rem;
  }
}

.hero__content {
  flex: 1;
  z-index: 2;
}

.hero__eyebrow {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8C7B72;
  margin-bottom: 0.75rem;
}

.hero__title {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 7vw, 4.5rem);
  font-weight: 700;
  color: #4A2C1A;
  line-height: 1.15;
  margin-bottom: 1rem;
}

.hero__subtitle {
  font-family: var(--font-body);
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  color: #5C3D2E;
  line-height: 1.7;
  margin-bottom: 1rem;
  max-width: 520px;
}

.hero__slogan {
  font-family: var(--font-accent);
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  color: #C9963A;
  margin-bottom: 1.75rem;
}

.hero__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.hero__badge {
  background: rgba(255,253,249,0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(247,197,208,0.6);
  border-radius: 50px;
  padding: 0.35rem 0.875rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #5C3D2E;
  white-space: nowrap;
}

.hero__cta-group {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  align-items: flex-start;
}

.hero__image-wrap {
  flex: 1;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(74,44,26,0.18);
  aspect-ratio: 4/5;
  max-height: 580px;
}

.hero__image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### Elementos decorativos del hero (SVG)

```css
/* Nubes y estrellas decorativas */
.hero__deco {
  position: absolute;
  pointer-events: none;
  z-index: 1;
}

.hero__deco--cloud-top-right {
  top: 5%;
  right: -5%;
  width: 220px;
  opacity: 0.35;
}

.hero__deco--stars-left {
  top: 20%;
  left: 2%;
  width: 80px;
  opacity: 0.5;
}

.hero__deco--cloud-bottom {
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  opacity: 0.2;
}
```

---

## 7. ESTILO PARA PRECIOS

### Precio principal (en card)

```css
.price-display {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  margin-bottom: 0.875rem;
}

.price-display__from {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #8C7B72;
}

.price-display__amount {
  font-family: var(--font-display);
  font-size: 1.875rem;
  font-weight: 700;
  color: #C9963A;
  line-height: 1;
}

.price-display__note {
  font-size: 0.7rem;
  color: #8C7B72;
  margin-top: 0.125rem;
}
```

### Precio activo (cuando se selecciona un tamaño)

```css
.price-selected {
  background: rgba(201,150,58,0.08);
  border: 1px solid rgba(201,150,58,0.25);
  border-radius: 12px;
  padding: 0.5rem 0.875rem;
  display: inline-flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 0.875rem;
}

.price-selected__label {
  font-size: 0.75rem;
  color: #8C7B72;
  font-weight: 600;
}

.price-selected__value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: #C9963A;
}
```

### Tabla de precios (sección dedicada)

```css
.price-table {
  background: #FFFDF9;
  border-radius: 16px;
  border: 1px solid rgba(247,197,208,0.5);
  overflow: hidden;
}

.price-table__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid rgba(247,197,208,0.3);
  transition: background 0.2s;
}

.price-table__row:last-child { border-bottom: none; }

.price-table__row:hover {
  background: rgba(247,197,208,0.15);
}

.price-table__row--popular {
  background: rgba(201,150,58,0.07);
}

.price-table__size {
  font-weight: 600;
  color: #4A2C1A;
  font-size: 0.9375rem;
}

.price-table__popular-tag {
  font-size: 0.65rem;
  background: #F5E0A0;
  color: #8A6200;
  padding: 0.1rem 0.45rem;
  border-radius: 50px;
  font-weight: 700;
  margin-left: 0.5rem;
}

.price-table__price {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: #C9963A;
}
```

---

## 8. ESTILO PARA FAQ

```css
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 720px;
  margin: 0 auto;
}

.faq-item {
  background: #FFFDF9;
  border: 1px solid rgba(247,197,208,0.5);
  border-radius: 16px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.faq-item.open {
  border-color: rgba(201,150,58,0.35);
  box-shadow: 0 4px 16px rgba(74,44,26,0.07);
}

.faq-item__question {
  width: 100%;
  background: transparent;
  border: none;
  padding: 1.125rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  color: #4A2C1A;
  line-height: 1.4;
}

.faq-item__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background: #F7C5D0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  transition: transform 0.25s ease, background 0.25s;
  color: #8B3A52;
}

.faq-item.open .faq-item__icon {
  transform: rotate(45deg);
  background: #C9963A;
  color: #FFFDF9;
}

.faq-item__answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease, padding 0.25s;
  padding: 0 1.25rem;
}

.faq-item.open .faq-item__answer {
  max-height: 300px;
  padding: 0 1.25rem 1.125rem;
}

.faq-item__answer p {
  font-size: 0.9rem;
  color: #5C3D2E;
  line-height: 1.7;
}
```

---

## 9. ESTILO PARA TESTIMONIOS

```css
.testimonials-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .testimonials-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }
}

.testimonial-card {
  background: #FFFDF9;
  border-radius: 20px;
  padding: 1.5rem;
  border: 1px solid rgba(247,197,208,0.5);
  box-shadow: 0 2px 16px rgba(74,44,26,0.06);
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  position: relative;
}

/* Comilla decorativa */
.testimonial-card::before {
  content: '"';
  position: absolute;
  top: 0.75rem;
  left: 1.25rem;
  font-family: var(--font-display);
  font-size: 4rem;
  color: rgba(247,197,208,0.6);
  line-height: 1;
  pointer-events: none;
}

.testimonial-card__stars {
  display: flex;
  gap: 0.2rem;
  color: #C9963A;
  font-size: 0.875rem;
}

.testimonial-card__quote {
  font-size: 0.9rem;
  color: #5C3D2E;
  line-height: 1.7;
  font-style: italic;
  padding-top: 1rem; /* espacio para la comilla */
}

.testimonial-card__author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
}

.testimonial-card__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #F7C5D0, #DDD0F0);
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid rgba(201,150,58,0.3);
}

.testimonial-card__name {
  font-weight: 700;
  font-size: 0.875rem;
  color: #4A2C1A;
}

.testimonial-card__city {
  font-size: 0.75rem;
  color: #8C7B72;
}
```

---

## 10. ESTILO PARA SECCIÓN WHATSAPP (CTA Final)

```css
.cta-final {
  background: linear-gradient(135deg, #F7C5D0 0%, #FDF6EC 50%, #DDD0F0 100%);
  border-radius: 32px;
  padding: 3.5rem 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin: 2rem 1rem;
}

@media (min-width: 768px) {
  .cta-final {
    padding: 5rem 3rem;
    margin: 3rem 2rem;
  }
}

.cta-final__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #4A2C1A;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.cta-final__subtitle {
  font-size: 1rem;
  color: #5C3D2E;
  line-height: 1.7;
  max-width: 520px;
  margin: 0 auto 2rem;
}

.cta-final__btn-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.cta-final__info {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: #8C7B72;
  font-weight: 600;
  margin-bottom: 1.25rem;
}

.cta-final__payments {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #5C3D2E;
}

/* Decoración de fondo */
.cta-final__deco-star {
  position: absolute;
  pointer-events: none;
  opacity: 0.2;
}
```

---

## 11. RECOMENDACIONES RESPONSIVE MOBILE-FIRST

### Breakpoints

```css
/* Mobile primero — sin media query */
/* base: 320px – 767px */

/* Tablet */
@media (min-width: 640px)  { /* sm  */ }
@media (min-width: 768px)  { /* md  */ }

/* Desktop */
@media (min-width: 1024px) { /* lg  */ }
@media (min-width: 1280px) { /* xl  */ }
```

### Reglas mobile-first

| Elemento | Mobile (default) | Desktop (≥1024px) |
|---|---|---|
| **Container max-width** | `100%` + padding `1.25rem` | `1200px` centrado, padding `2rem` |
| **Grid de productos** | 1 columna | 2-3 columnas |
| **Grid de beneficios** | 2×2 | 4 en fila |
| **Grid testimonios** | 1 columna, carrusel | 3 en fila |
| **Hero layout** | Stack vertical | Side-by-side 50/50 |
| **Timeline "Cómo comprar"** | Vertical, pasos apilados | Horizontal con línea conectora |
| **Navbar** | Logo + botón WA | Logo + slogan + botón WA |
| **Botón flotante WA** | Siempre visible, bottom-right | Siempre visible, bottom-right |
| **Font size H1** | `clamp(2.25rem, 7vw, 4.5rem)` | Se escala automáticamente |
| **Botones** | `width: 100%` en stacks | `width: auto` en línea |
| **Galería** | 2 columnas | 3 columnas |
| **FAQ** | Accordion full-width | Accordion centrado max 720px |
| **Sección precios pills** | `overflow-x: auto` scroll horizontal | Sin scroll, todos visibles |

### Espaciado de secciones

```css
section {
  padding: 3.5rem 1.25rem;    /* mobile */
}

@media (min-width: 768px) {
  section {
    padding: 5rem 2rem;
  }
}

@media (min-width: 1024px) {
  section {
    padding: 6rem 4rem;
  }
}
```

### Reglas de accesibilidad táctil

```css
/* Todo elemento interactivo: mínimo 48×48px táctil */
button, a, .size-pill, .faq-item__question {
  min-height: 48px;
}

/* Espaciado entre elementos táctiles */
.btn-group > * + * {
  margin-top: 0.75rem;
}
```

### Separadores de sección decorativos

```css
/* Ola SVG entre secciones */
.section-divider {
  width: 100%;
  overflow: hidden;
  line-height: 0;
  margin-bottom: -2px;
}

.section-divider svg {
  width: 100%;
  height: 60px;
  fill: currentColor;
}

/* Línea decorativa con estrella central */
.section-divider--stars {
  text-align: center;
  color: #F7C5D0;
  font-size: 1.25rem;
  letter-spacing: 0.75rem;
  margin: 0.5rem 0;
}
```

---

## RESUMEN DEL SISTEMA DE DISEÑO

| Token | Valor |
|---|---|
| **Color primario** | `#F7C5D0` Rosa pastel |
| **Color acento** | `#C9963A` Dorado suave |
| **Color texto** | `#4A2C1A` Marrón chocolate |
| **Fondo base** | `#FDF6EC` Crema marfil |
| **Radio tarjetas** | `20px` |
| **Radio botones** | `50px` (pill) |
| **Sombra base** | `0 2px 16px rgba(74,44,26,0.07)` |
| **Transición base** | `all 0.25s ease` |
| **Font display** | Cormorant Garamond |
| **Font heading** | Playfair Display |
| **Font body** | Nunito |
| **Font accent** | Dancing Script |

---

*Documento generado como parte del plan estratégico de SEGEDA HOME · Mayo 2026*
*Próximo paso: Implementación HTML + CSS — Fase 1*
