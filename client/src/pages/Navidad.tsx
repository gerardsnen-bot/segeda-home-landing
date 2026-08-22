/**
 * Réplica fiel de Preventa Navideña: composición estacional con modelos reales,
 * oferta escalonada y selector por cantidades según la página original de Segeda Home.
 */
import { useMemo } from "react";
import { ArrowRight, ChevronDown, Minus, Plus, ShoppingCart, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { SegedaCartItem, useSegedaCart } from "@/lib/segedaCart";

const SOURCE = "https://segeda-home-tienda.mad-elynnlevon7.chatgpt.site";
const WHATSAPP = "https://wa.me/51978642447?text=";

const categoryLinks = [
  ["✼", "Preventa Navideña", "navidad"], ["☁", "Nubes temáticas", "nubes"], ["○", "Placas circulares", "placas"],
  ["▣", "Cuadros infantiles", "cuadros"], ["✦", "Combo completo", "combo"], ["☁", "Nube + cuadros", "nube-cuadros"],
  ["☼", "Nube + cuadros + lámpara", "nube-cuadros-lampara"], ["Aa", "Nombre + cuadros", "nombre-cuadros"], ["✧", "Packs lamparitas", "packs"],
  ["☼", "Lámparas", "lamparas"], ["%", "Liquidación", "liquidacion"], ["✦", "Fe y espiritualidad", "fe-espiritualidad"],
  ["♡", "Alcancías y regalos", "alcancias"], ["ABC", "Didácticos", "didacticos"],
];

const models = Array.from({ length: 9 }, (_, index) => ({
  id: index + 1,
  title: `Modelo ${index + 1}`,
  image: `${SOURCE}/navidad-preventa/modelo-${index + 1}.webp`,
}));

export default function Navidad() {
  const { items, quantity: cartQuantity, total, updateCart } = useSegedaCart();
  const amounts = useMemo(() => Object.fromEntries(items.filter((item) => item.category === "navidad").map((item) => [Number(item.id.replace("navidad-", "")), item.quantity])), [items]);
  const quantity = useMemo(() => Object.values(amounts).reduce<number>((sum, value) => sum + value, 0), [amounts]);
  const unitPrice = quantity >= 2 ? 69 : 79;
  const selected = models.filter((model) => amounts[model.id]).map((model) => `${model.title} × ${amounts[model.id]}`).join(", ");

  const changeAmount = (id: number, delta: number) => updateCart((current) => {
    const model = models.find((item) => item.id === id);
    if (!model) return current;
    const itemId = `navidad-${id}`;
    const existing = current.find((item) => item.id === itemId);
    const nextQuantity = Math.max(0, (existing?.quantity ?? 0) + delta);
    const withoutCurrent = current.filter((item) => item.id !== itemId);
    const next: SegedaCartItem[] = nextQuantity ? [...withoutCurrent, { id: itemId, category: "navidad", title: model.title, image: model.image, quantity: nextQuantity, unitPrice: 79 }] : withoutCurrent;
    const navidadQuantity = next.filter((item) => item.category === "navidad").reduce((sum, item) => sum + item.quantity, 0);
    return next.map((item) => item.category === "navidad" ? { ...item, unitPrice: navidadQuantity >= 2 ? 69 : 79 } : item);
  });

  const scrollToModels = () => document.getElementById("navidad-modelos")?.scrollIntoView({ behavior: "smooth" });
  const sendOrder = () => {
    if (!quantity) { scrollToModels(); return; }
    const message = `Hola Segeda Home, quiero reservar ${quantity} letrero${quantity > 1 ? "s" : ""} de Preventa Navideña. Modelos: ${selected}. Total de preventa: S/${total}.`;
    window.open(`${WHATSAPP}${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="navidad-page">
      <header className="navidad-header">
        <Link href="/catalogo" className="navidad-brand"><img src="/manus-storage/segeda-logo_2fda80cf.jpg" alt="Segeda Home" /><span><strong>Segeda Home</strong><small>PREVENTA NAVIDEÑA</small></span></Link>
        <div className="navidad-actions"><button onClick={scrollToModels}>Ver modelos</button><Link href="/catalogo" aria-label="Abrir el carrito principal" className="navidad-cart"><ShoppingCart size={16} /><i>{cartQuantity}</i></Link></div>
      </header>

      <nav className="navidad-rail" aria-label="Explora otras categorías"><div className="navidad-rail-title"><span>✦</span><b>Explora</b><small>OTRAS<br />CATEGORÍAS</small></div><div className="navidad-rail-items">{categoryLinks.map(([icon, title, slug]) => <Link key={title} href={`/catalogo/${slug}`} className={`navidad-pill ${slug === "navidad" ? "selected" : ""}`}><i>{icon}</i>{title}</Link>)}</div></nav>

      <main>
        <section className="navidad-hero">
          <div className="snowfall" aria-hidden="true">✦ · ❄ · ✦ · ❄ · ✦ · ❄ · ✦ · ❄ · ✦</div>
          <p className="navidad-kicker">✦ Colección especial 2026 ✦</p>
          <h1>Preventa Navideña</h1>
          <p className="navidad-intro">Letreros personalizados con el apellido de tu familia. Elige uno, combina varios o repite tu modelo favorito.</p>
          <div className="navidad-prices"><article><p>1 LETRERO</p><del>Regular S/109</del><strong>S/79</strong><small>Precio de preventa</small></article><article className="multi"><p>DESDE 2 LETREROS</p><del>Regular S/109 c/u</del><strong>S/69 c/u</strong><small>2 por S/138</small></article></div>
          <div className="navidad-perks"><span>♡ Personalizado con apellido</span><span>✦ 9 modelos disponibles</span><span>◷ Preparación de 5 a 7 días</span><span>✓ Reserva con 50%</span><span>🚚 Envíos a todo el Perú</span></div>
        </section>

        <section id="navidad-modelos" className="navidad-models"><p className="navidad-kicker">Compra fácil y rápida</p><h2>Elige tus modelos favoritos</h2><p>Usa + para seleccionar. Puedes escoger modelos diferentes o pedir dos iguales.</p><div className="navidad-grid">{models.map((model) => { const selectedAmount = amounts[model.id] ?? 0; return <article className="navidad-model" key={model.id}><img src={model.image} alt={`Letrero navideño ${model.title}`} /><div className="navidad-model-copy"><p>PREVENTA NAVIDEÑA</p><h3>{model.title}</h3><span>Personalizado con el apellido de tu familia</span><div className="quantity-control"><button onClick={() => changeAmount(model.id, -1)} disabled={!selectedAmount} aria-label={`Quitar ${model.title}`}><Minus size={15} /></button><div><b>{selectedAmount}</b><small>{selectedAmount === 1 ? "ELEGIDO" : "ELEGIDOS"}</small></div><button onClick={() => changeAmount(model.id, 1)} aria-label={`Seleccionar ${model.title}`}><Plus size={16} /></button></div><button className="select-model" onClick={() => changeAmount(model.id, 1)}>{selectedAmount ? "Agregar otro" : "Seleccionar modelo"}</button></div></article>; })}</div>
          <section className="navidad-summary"><div><p>{quantity} PRODUCTO{quantity !== 1 ? "S" : ""} NAVIDEÑO{quantity !== 1 ? "S" : ""} EN EL CARRITO</p><h3>{quantity ? "Modelos seleccionados" : "Elige tu modelo favorito"}</h3></div><div className="summary-total"><p>TOTAL PREVENTA</p><strong>S/{total}</strong></div><button onClick={sendOrder}><ShoppingCart size={16} /> {quantity ? "Pedir por WhatsApp" : "Elegir modelos"}</button></section>
        </section>
      </main>

      <footer className="navidad-footer"><div><strong>Segeda Home</strong><span>Diseños personalizados en MDF · Envíos a todo el Perú</span></div><Link href="/catalogo">Volver a la tienda principal <ArrowRight size={13} /></Link></footer>
      <style>{`
        .navidad-page{min-height:100vh;background:#fcf8eb;color:#563d36;font-family:'DM Sans',Arial,sans-serif}.navidad-header{height:69px;padding:0 max(25px,calc((100% - 1180px)/2));display:flex;align-items:center;justify-content:space-between;background:#fffdf7;border-bottom:1px solid #ece2d1}.navidad-brand{display:flex;align-items:center;gap:9px}.navidad-brand img{width:57px;height:57px;object-fit:contain}.navidad-brand span{display:flex;flex-direction:column;gap:1px}.navidad-brand strong{font:600 23px 'Playfair Display',Georgia,serif;color:#773e36}.navidad-brand small{font:700 7px 'DM Sans',Arial,sans-serif;letter-spacing:.16em;color:#a3313d}.navidad-actions{display:flex;align-items:center;gap:12px}.navidad-actions>button:first-child{border:0;border-radius:999px;background:linear-gradient(100deg,#a7182c,#7b1833);padding:12px 20px;box-shadow:0 5px 12px rgba(132,31,42,.18);color:#fff;font:700 11px 'DM Sans',sans-serif}.navidad-cart{height:37px;width:37px;display:grid;place-items:center;border:1px solid #ddc6aa;border-radius:50%;background:#fffdf7;color:#7d4a35;position:relative}.navidad-cart i{position:absolute;right:-5px;top:-6px;border-radius:999px;background:#bf2739;color:#fff;font:700 8px 'DM Sans',sans-serif;min-width:14px;height:14px;display:grid;place-items:center;font-style:normal}.navidad-rail{height:65px;display:flex;align-items:center;background:#fffdf8;border-bottom:1px solid #e6ddca}.navidad-rail-title{height:100%;width:104px;flex:0 0 104px;display:grid;grid-template-columns:13px 1fr;grid-template-rows:20px 1fr;align-content:center;gap:0 3px;padding-left:26px;color:#785442}.navidad-rail-title>span{grid-row:span 2;color:#be9271;font-size:11px}.navidad-rail-title b{font:600 13px 'Playfair Display',Georgia,serif;line-height:1}.navidad-rail-title small{font:700 5px 'DM Sans',sans-serif;letter-spacing:.14em;line-height:1.25}.navidad-rail-items{display:flex;align-items:center;gap:8px;overflow-x:auto;padding:0 12px;white-space:nowrap;scrollbar-width:none}.navidad-rail-items::-webkit-scrollbar{display:none}.navidad-pill{display:inline-flex;align-items:center;gap:6px;padding:10px 13px;border:1px solid #ece0d2;border-radius:6px;background:#fffefb;color:#5e463c;font-size:10px;box-shadow:0 2px 4px rgba(92,64,45,.03)}.navidad-pill i{font-style:normal;color:#b97a68}.navidad-pill.selected{border-color:#b72738;background:#fff1e7;box-shadow:0 3px 7px rgba(173,37,50,.16)}.navidad-hero{min-height:360px;position:relative;text-align:center;padding:52px 20px 35px;overflow:hidden;background:radial-gradient(circle at 25% 15%,rgba(249,239,214,.75),transparent 30%),radial-gradient(circle at 83% 40%,rgba(229,246,233,.55),transparent 31%),#fbf8eb}.navidad-hero::before,.navidad-hero::after{content:'✦';position:absolute;color:#e9d6a7;font-size:17px;opacity:.85}.navidad-hero::before{top:64px;left:13%}.navidad-hero::after{top:92px;right:14%}.snowfall{position:absolute;left:-20px;right:-20px;top:14px;color:#d6c79c;font:500 13px 'Playfair Display',Georgia,serif;letter-spacing:19px;opacity:.75;white-space:nowrap}.navidad-kicker{margin:0;color:#a67955;text-transform:uppercase;font:700 9px 'DM Sans',Arial,sans-serif;letter-spacing:.2em}.navidad-hero h1{margin:11px 0 10px;color:#9f1f2f;font:500 clamp(43px,5vw,64px)/1 'Playfair Display',Georgia,serif;letter-spacing:-.04em}.navidad-intro{margin:0 auto 20px;max-width:470px;font:14px/1.58 'Playfair Display',Georgia,serif;color:#725d51}.navidad-prices{display:flex;justify-content:center;gap:13px}.navidad-prices article{width:220px;padding:14px 18px 12px;border:1px solid #eadfce;border-bottom:5px solid #d9c9a1;border-radius:14px;background:#fffdf8;box-shadow:0 6px 11px rgba(91,65,45,.06)}.navidad-prices article.multi{border:2px solid #b42332;border-bottom-width:5px;background:#fff9ee}.navidad-prices p{margin:0 0 2px;font-size:8px;font-weight:800;color:#644b40;letter-spacing:.08em}.navidad-prices del{display:block;font-size:8px;color:#a88f7d}.navidad-prices strong{display:block;font:600 28px/1 'Playfair Display',Georgia,serif;color:#af1e2e}.navidad-prices small{color:#497b57;font-size:8px;font-weight:700}.navidad-perks{display:flex;justify-content:center;flex-wrap:wrap;gap:7px;margin-top:19px}.navidad-perks span{border:1px solid #e7dece;border-radius:999px;background:rgba(255,254,248,.82);padding:6px 9px;color:#6b594c;font-size:8px}.navidad-models{padding:60px max(20px,calc((100% - 1120px)/2)) 72px;background:linear-gradient(115deg,#fff1e6 0%,#f9faec 58%,#eaf4e8 100%)}.navidad-models>.navidad-kicker{text-align:center}.navidad-models>h2{margin:10px 0 5px;text-align:center;color:#2e6b45;font:500 clamp(37px,4vw,50px)/1 'Playfair Display',Georgia,serif;letter-spacing:-.035em}.navidad-models>p:not(.navidad-kicker){margin:0 auto 27px;text-align:center;color:#796b5d;font-size:11px}.navidad-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:17px}.navidad-model{overflow:hidden;border:1px solid #eadfcd;border-radius:13px;background:#fffef9;box-shadow:0 9px 17px rgba(86,58,38,.10)}.navidad-model>img{display:block;width:100%;aspect-ratio:1.03;object-fit:cover;background:#f3ecdd}.navidad-model-copy{padding:14px 14px 13px}.navidad-model-copy>p{margin:0;color:#ad7c51;font-size:8px;letter-spacing:.12em;font-weight:800}.navidad-model h3{margin:5px 0 3px;color:#9e1e2e;font:600 22px 'Playfair Display',Georgia,serif}.navidad-model-copy>span{display:block;color:#776358;font-size:9px}.quantity-control{display:grid;grid-template-columns:33px 1fr 33px;gap:6px;margin-top:13px}.quantity-control button{height:33px;border:0;border-radius:8px;background:#b82939;color:#fff;display:grid;place-items:center}.quantity-control button:disabled{background:#bad0c3;color:#fff}.quantity-control>div{display:flex;flex-direction:column;justify-content:center;align-items:center;border:1px solid #e9dfcd;border-radius:8px;background:#fffdf5}.quantity-control b{font-size:13px;color:#9e1e2e;line-height:1}.quantity-control small{font-size:6px;font-weight:800;color:#a7927a;letter-spacing:.07em;margin-top:2px}.select-model{height:34px;width:100%;margin-top:8px;border:0;border-radius:7px;color:#fff;background:linear-gradient(100deg,#bc1f30 0%,#9d1c32 58%,#356b48 100%);font-size:9px;font-weight:700}.navidad-summary{position:sticky;bottom:17px;z-index:3;display:grid;grid-template-columns:1fr 145px 185px;align-items:center;gap:18px;margin:28px auto 0;max-width:950px;padding:14px 18px;border:1px solid #d2c28d;border-radius:14px;background:linear-gradient(105deg,#0c6a44,#0c5039);box-shadow:0 12px 21px rgba(26,66,43,.25);color:#fff}.navidad-summary p{margin:0;font-size:7px;letter-spacing:.08em;font-weight:700}.navidad-summary h3{margin:4px 0 0;font:500 17px 'Playfair Display',Georgia,serif}.summary-total{text-align:center;border-left:1px solid rgba(255,255,255,.22);border-right:1px solid rgba(255,255,255,.22)}.summary-total strong{font:500 26px 'Playfair Display',Georgia,serif;color:#f9e5a8}.navidad-summary>button{justify-self:end;display:flex;align-items:center;gap:8px;padding:12px 17px;border:2px solid #f2f3d1;border-radius:9px;background:#1c8156;color:#fff;font-size:10px;font-weight:700;box-shadow:inset 0 0 0 1px rgba(255,255,255,.28)}.navidad-footer{display:flex;align-items:center;justify-content:center;gap:22px;padding:30px 20px;background:#f3e5d6;color:#6d4a3e}.navidad-footer>div{display:flex;align-items:center;gap:12px}.navidad-footer strong{font:600 19px 'Playfair Display',Georgia,serif;color:#8c2b2e}.navidad-footer span{font-size:9px}.navidad-footer a{display:inline-flex;align-items:center;gap:5px;border-radius:999px;background:#f8f5e9;color:#497b57;padding:7px 10px;font-size:9px;font-weight:700}@media(max-width:700px){.navidad-header{height:62px;padding:0 15px}.navidad-brand img{width:47px;height:47px}.navidad-brand strong{font-size:18px}.navidad-brand small{font-size:5px}.navidad-actions>button:first-child{padding:10px 13px;font-size:9px}.navidad-rail{height:57px}.navidad-rail-title{flex-basis:72px;width:72px;padding-left:10px}.navidad-pill{font-size:9px}.navidad-hero{padding:45px 15px 28px}.navidad-hero h1{font-size:45px}.navidad-intro{font-size:12px;max-width:340px}.navidad-prices{gap:8px}.navidad-prices article{width:calc(50vw - 22px);padding:12px 7px 10px}.navidad-prices strong{font-size:24px}.navidad-perks{gap:5px}.navidad-perks span{font-size:7px;padding:5px 7px}.navidad-models{padding:50px 13px 62px}.navidad-models>h2{font-size:36px}.navidad-grid{gap:10px;grid-template-columns:1fr 1fr}.navidad-model h3{font-size:17px}.navidad-model-copy{padding:11px}.navidad-model-copy>span{font-size:8px;line-height:1.3}.quantity-control{grid-template-columns:27px 1fr 27px;gap:4px;margin-top:10px}.quantity-control button{height:28px}.select-model{height:30px;font-size:8px}.navidad-summary{grid-template-columns:1fr auto;gap:9px;padding:12px;bottom:10px}.navidad-summary h3{font-size:14px}.summary-total{border:0;text-align:right}.summary-total strong{font-size:21px}.navidad-summary>button{grid-column:1 / -1;width:100%;justify-content:center;padding:10px}.navidad-footer{flex-direction:column;gap:12px;text-align:center}.navidad-footer>div{flex-direction:column;gap:5px}.navidad-footer span{font-size:8px}}
        .navidad-model>img{object-fit:contain!important;background:#f8f1e4!important}
        /* Navegación de categorías destacada para la preventa. */
        .navidad-pill{min-height:39px;border-color:#e4cbbb!important;background:linear-gradient(145deg,#fffdf9,#faeee5)!important;box-shadow:0 5px 10px rgba(106,68,48,.08)!important;font-weight:700;transition:transform .16s ease,box-shadow .16s ease}.navidad-pill i{display:grid;place-items:center;width:19px;height:19px;border-radius:50%;background:#f2d8c7;color:#994e45!important}.navidad-pill:hover{transform:translateY(-3px);border-color:#bb6658!important;box-shadow:0 9px 15px rgba(128,66,54,.15)!important}.navidad-pill.selected{border-color:#9d433c!important;background:linear-gradient(135deg,#b85247,#823b39)!important;box-shadow:0 7px 14px rgba(139,52,48,.25)!important;color:#fff}.navidad-pill.selected i{background:rgba(255,255,255,.2);color:#fff!important}
      `}</style>
    </div>
  );
}
