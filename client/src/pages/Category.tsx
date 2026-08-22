/**
 * Réplica Segeda Home — vista de categoría conectada a la instantánea del catálogo original.
 * Mantiene el lenguaje editorial marfil/coral/cacao y muestra productos, imágenes y precios reales.
 */
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, MessageCircle, Sparkles } from "lucide-react";
import { Link, useRoute } from "wouter";

const WHATSAPP = "https://wa.me/51978642447?text=";
const CATALOG_URL = "/manus-storage/segeda-real-products_a00909f3.json";

type CatalogProduct = {
  id: number | string;
  title: string;
  description: string;
  price: number;
  compareAtPrice: number;
  sizes: { label: string; price: number }[];
  tags: string;
  audience: string;
  themeGroup: string;
  estimatedDays: string;
  featured: boolean;
  imageUrl: string;
};

type CatalogSnapshot = { collection: Record<string, CatalogProduct[]> };
type CategoryData = { title: string; kicker: string; description: string; image: string };

const categories: Record<string, CategoryData> = {
  navidad: { title: "Preventa Navideña", kicker: "Colección especial 2026 · Desde S/79", description: "Letreros personalizados con el apellido de tu familia. Elige uno, combina varios o repite tu modelo favorito.", image: "/manus-storage/navidad_c98eafac.jpg" },
  nubes: { title: "Nubes temáticas", kicker: "Colección destacada", description: "Nubes con nombres, personajes y luz cálida para transformar espacios infantiles.", image: "/manus-storage/nubes-portada-premium_f843e2ec.jpeg" },
  placas: { title: "Placas circulares", kicker: "Diseños personalizados", description: "Placas redondas en MDF creadas con la temática, nombre y colores de su espacio.", image: "/manus-storage/placas_f2df896b.jpg" },
  cuadros: { title: "Cuadros infantiles", kicker: "Detalles para su habitación", description: "Cuadros coordinados para acompañar nombres, personajes y composiciones infantiles.", image: "/manus-storage/cuadros_0fdc2e1c.jpg" },
  combo: { title: "Combo completo", kicker: "Una composición lista para instalar", description: "Nombre, cuadros y luz diseñados como una sola composición para la habitación.", image: "/manus-storage/combo_d729a5a2.jpg" },
  "nube-cuadros": { title: "Nube + cuadros", kicker: "Combinación favorita", description: "Una nube principal acompañada por cuadros para crear una pared con identidad.", image: "/manus-storage/nube-cuadros_4f013700.jpg" },
  "nube-cuadros-lampara": { title: "Nube + cuadros + lámpara", kicker: "Composición iluminada", description: "Un set completo con iluminación cálida y detalles coordinados para su espacio.", image: "/manus-storage/nubes-portada-premium_f843e2ec.jpeg" },
  "nombre-cuadros": { title: "Nombre + cuadros", kicker: "Un detalle para su pared", description: "Nombres en MDF y cuadros decorativos con la temática que imaginas.", image: "/manus-storage/combo_d729a5a2.jpg" },
  packs: { title: "Packs lamparitas", kicker: "Luz cálida para su espacio", description: "Piezas de iluminación decorativa creadas para acompañar sus momentos cotidianos.", image: "/manus-storage/instalacion-real-nubes_eee88aa5.jpg" },
  lamparas: { title: "Lámparas", kicker: "Iluminación cálida", description: "Lámparas decorativas con formas, colores y detalles especiales para cada habitación.", image: "/manus-storage/instalacion-real-nubes_eee88aa5.jpg" },
  liquidacion: { title: "Liquidación", kicker: "Últimas unidades", description: "Diseños disponibles para coordinar por WhatsApp según stock y personalización.", image: "/manus-storage/navidad_c98eafac.jpg" },
  "fe-espiritualidad": { title: "Fe y espiritualidad", kicker: "Nueva línea para el hogar", description: "Piezas que inspiran y dan significado a cada espacio, creadas en MDF con acabado cálido.", image: "/manus-storage/fe-espiritualidad_546155f2.png" },
  alcancias: { title: "Alcancías y regalos", kicker: "Detalles para regalar", description: "Regalos personalizados para celebrar etapas, nombres y momentos importantes.", image: "/manus-storage/placas_f2df896b.jpg" },
  didacticos: { title: "Didácticos", kicker: "Aprender también es jugar", description: "Recursos en MDF pensados para acompañar el aprendizaje desde el juego.", image: "/manus-storage/cuadros_0fdc2e1c.jpg" },
};

function readableTheme(theme: string) {
  return theme ? theme.replaceAll("-", " ") : "Diseño personalizado";
}

export default function Category() {
  const [, params] = useRoute("/catalogo/:category");
  const slug = params?.category ?? "nubes";
  const category = categories[slug] ?? categories.nubes;
  const [snapshot, setSnapshot] = useState<CatalogSnapshot | null>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setVisibleCount(12);
    fetch(CATALOG_URL)
      .then((response) => response.json())
      .then((data: CatalogSnapshot) => { if (active) setSnapshot(data); })
      .catch(() => { if (active) setSnapshot({ collection: {} }); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  const products = snapshot?.collection[slug] ?? [];
  const shownProducts = products.slice(0, visibleCount);
  const heroMessage = `Hola Segeda Home, quiero consultar por ${category.title}`;

  return (
    <div className="category-page">
      <div className="category-topbar"><span>♡ Hecho con amor</span><span>✦ Envíos a todo el Perú</span></div>
      <header className="category-header">
        <Link href="/catalogo" className="category-brand"><img src="/manus-storage/segeda-logo_2fda80cf.jpg" alt="Segeda Home" /><span><strong>Segeda Home</strong><small>DETALLES PERSONALIZADOS EN MDF</small></span></Link>
        <Link href="/catalogo" className="category-back"><ArrowLeft size={16} /> Volver al catálogo</Link>
      </header>
      <main>
        <section className="category-hero">
          <div className="category-hero-copy"><p>{category.kicker}</p><h1>{category.title}</h1><span className="category-spark"><Sparkles size={15} /></span><p className="category-description">{category.description}</p><a href={`${WHATSAPP}${encodeURIComponent(heroMessage)}`} target="_blank" rel="noreferrer" className="category-whatsapp">Coordinar por WhatsApp <MessageCircle size={16} /></a></div>
          <div className="category-hero-image"><img src={category.image} alt={category.title} /><span>Hecho a mano · MDF premium</span></div>
        </section>
        <section className="category-models">
          <p className="category-kicker">✦ Modelos reales de la colección ✦</p>
          <h2>Elige un diseño y <em>personalízalo a tu manera.</em></h2>
          <p>{loading ? "Cargando los diseños disponibles…" : `${products.length} diseños disponibles. Elige un modelo y coordina nombre, medidas, colores y temática antes de elaborar.`}</p>
          {loading ? <div className="category-loading">Preparando el catálogo…</div> : shownProducts.length ? <>
            <div className="category-card-grid">{shownProducts.map((product) => <article key={String(product.id)} className="category-card"><img src={product.imageUrl} alt={product.title} loading="lazy" /><div><span>{readableTheme(product.themeGroup)}</span><h3>{product.title}</h3><p className="category-product-meta">{product.estimatedDays || "Personalizable"}{product.sizes.length ? ` · ${product.sizes[0].label}` : ""}</p><p className="category-price">{product.compareAtPrice > product.price && <del>S/{product.compareAtPrice}</del>} Personalizable desde <b>S/{product.price}</b></p><a href={`${WHATSAPP}${encodeURIComponent(`Hola Segeda Home, quiero el modelo ${product.title}`)}`} target="_blank" rel="noreferrer">Elegir este modelo <ArrowRight size={14} /></a></div></article>)}</div>
            {shownProducts.length < products.length && <button className="category-load-more" onClick={() => setVisibleCount((count) => count + 12)}>Ver más diseños <ChevronRight size={16} /></button>}
          </> : <div className="category-loading">No se encontraron modelos para esta colección.</div>}
        </section>
        <section className="category-next"><div><p>¿Buscas otra opción?</p><h2>Explora todas las categorías de Segeda Home.</h2></div><Link href="/catalogo" className="category-outline">Ver el catálogo <ChevronRight size={16} /></Link></section>
      </main>
      <footer className="category-footer"><span className="serif">Segeda Home<sup>♡</sup></span><p>Diseño y personalización en MDF para niños, hogares y momentos especiales.</p></footer>
      <style>{`
        .category-page{min-height:100vh;background:#fffaf4;color:#513a30;font-family:'DM Sans',Arial,sans-serif}.category-topbar{height:28px;background:#5b4034;color:#fffaf4;display:flex;align-items:center;justify-content:center;gap:42px;text-transform:uppercase;letter-spacing:.12em;font-size:8px;font-weight:700}.category-header{height:90px;display:flex;justify-content:space-between;align-items:center;width:min(1170px,calc(100% - 40px));margin:auto}.category-brand{display:flex;align-items:center;gap:10px}.category-brand img{height:60px;width:78px;object-fit:contain}.category-brand span{display:flex;flex-direction:column;gap:3px}.category-brand strong{font:600 24px 'Playfair Display',Georgia,serif}.category-brand small{font-size:7px;letter-spacing:.16em;color:#806a5e}.category-back{display:flex;align-items:center;gap:7px;font:600 12px 'DM Sans',sans-serif;color:#806a5e}.category-hero{display:grid;grid-template-columns:.88fr 1.12fr;gap:70px;align-items:center;width:min(1170px,calc(100% - 40px));margin:18px auto 0;padding:60px 65px;border-radius:30px;background:linear-gradient(118deg,#fff8f1 20%,#fae3d4 100%);box-shadow:0 17px 30px rgba(91,64,52,.06)}.category-hero-copy>p:first-child,.category-kicker{margin:0;color:#a37e55;font-weight:700;font-size:10px;letter-spacing:.17em;text-transform:uppercase}.category-hero h1,.category-models h2,.category-next h2{font:600 clamp(43px,5vw,64px)/.99 'Playfair Display',Georgia,serif;letter-spacing:-.045em;margin:13px 0 5px}.category-spark{color:#c69e68}.category-description{max-width:390px;color:#776255;line-height:1.65;font-size:14px;margin:17px 0 24px}.category-whatsapp{display:inline-flex;align-items:center;gap:8px;padding:14px 19px;border-radius:999px;background:#24c86e;color:#fff;font-weight:700;font-size:12px;box-shadow:0 9px 17px rgba(36,200,110,.22)}.category-hero-image{height:335px;border-radius:28px;overflow:hidden;position:relative;box-shadow:0 15px 25px rgba(91,64,52,.12)}.category-hero-image img{width:100%;height:100%;object-fit:cover}.category-hero-image span{position:absolute;right:14px;top:14px;border-radius:99px;padding:7px 10px;background:rgba(70,48,37,.86);color:#fff;font-size:8px;font-weight:700}.category-models{width:min(1100px,calc(100% - 40px));margin:83px auto 88px;text-align:center}.category-models h2{font-size:42px;max-width:650px;margin:10px auto 12px}.category-models h2 em{color:#c77f72;font-style:italic}.category-models>p:not(.category-kicker){max-width:610px;margin:0 auto 29px;color:#776255;font-size:13px;line-height:1.6}.category-card-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;text-align:left}.category-card{overflow:hidden;border:1px solid #eadfd5;border-radius:21px;background:#fffdf9;box-shadow:0 8px 20px rgba(91,64,52,.04);transition:transform .17s ease,box-shadow .17s ease}.category-card:hover{transform:translateY(-4px);box-shadow:0 15px 25px rgba(91,64,52,.10)}.category-card>img{width:100%;height:205px;object-fit:cover;display:block;background:#f4e8de}.category-card div{padding:16px 17px 18px}.category-card span{font-size:8px;letter-spacing:.14em;color:#a37e55;text-transform:uppercase;font-weight:700}.category-card h3{font:600 21px 'Playfair Display',Georgia,serif;margin:7px 0 7px}.category-product-meta{font-size:10px;color:#8c7567;margin:0 0 8px}.category-price{font-size:10px;color:#876e61;margin:0 0 13px}.category-price del{margin-right:4px;color:#aa978b}.category-price b{font-size:13px;color:#513a30}.category-card a{display:flex;align-items:center;gap:5px;color:#c77f72;font-size:11px;font-weight:700}.category-loading{margin:22px auto;padding:34px;max-width:400px;border:1px solid #eadfd5;border-radius:18px;color:#8c7567;font-size:13px;background:#fffdf9}.category-load-more{display:inline-flex;align-items:center;gap:7px;margin:27px auto 0;border:1px solid #e1c9bb;border-radius:999px;background:#fffdf9;color:#806a5e;padding:12px 19px;font:700 11px 'DM Sans',Arial,sans-serif;transition:transform .15s ease}.category-load-more:hover{transform:translateY(-2px)}.category-next{width:min(1170px,calc(100% - 40px));margin:0 auto 56px;padding:35px 42px;border-radius:23px;background:#f5e5dc;display:flex;align-items:center;justify-content:space-between;gap:32px}.category-next p{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#a37e55;margin:0 0 5px;font-weight:700}.category-next h2{font-size:29px;margin:0;letter-spacing:-.03em}.category-outline{display:flex;align-items:center;gap:7px;white-space:nowrap;border:1px solid #dccabc;border-radius:99px;background:#fffaf4;color:#806a5e;padding:12px 18px;font-size:11px;font-weight:700}.category-footer{background:#5b4034;color:#fffaf4;padding:33px max(20px,calc((100% - 1170px)/2));display:flex;justify-content:space-between;align-items:center;gap:25px}.category-footer span{font-size:26px}.category-footer sup{color:#f2b4a8;font-size:12px}.category-footer p{font-size:11px;color:#eadbd0;margin:0}@media(max-width:720px){.category-header{height:74px;width:calc(100% - 28px)}.category-brand img{height:46px;width:55px}.category-brand strong{font-size:19px}.category-brand small{font-size:5px}.category-back{font-size:10px}.category-topbar{gap:14px;font-size:7px}.category-hero{width:100%;margin:0;grid-template-columns:1fr;gap:27px;padding:42px 23px 25px;border-radius:0}.category-hero h1{font-size:47px}.category-hero-image{height:260px}.category-models{width:calc(100% - 28px);margin:58px auto}.category-models h2{font-size:33px}.category-card-grid{grid-template-columns:1fr;gap:13px}.category-card{display:grid;grid-template-columns:120px 1fr}.category-card>img{height:100%}.category-card div{padding:15px}.category-card h3{font-size:19px}.category-next{width:calc(100% - 28px);padding:27px 22px;align-items:flex-start;flex-direction:column}.category-next h2{font-size:26px}.category-footer{align-items:flex-start;flex-direction:column}.category-footer p{max-width:290px}}
      `}</style>
    </div>
  );
}
