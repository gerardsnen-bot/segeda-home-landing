import fs from "node:fs";

const replacements = {
  "/manus-storage/segeda-mark_e690aa44.png": "/assets/legacy/segeda-mark_e690aa44.png",
  "/manus-storage/blush-cta-texture_678e58d4.jpg": "/assets/legacy/blush-cta-texture_678e58d4.jpg",
  "/manus-storage/soft-paper-texture_0c3e5549.jpg": "/assets/legacy/soft-paper-texture_0c3e5549.jpg",
  "/manus-storage/mdfantasy-logo-oficial-agosto-2026_3627de6b.png": "/assets/legacy/mdfantasy-logo-oficial-agosto-2026_3627de6b.png",
  "/manus-storage/combo_d729a5a2.jpg": "/assets/legacy/combo_d729a5a2.jpg",
  "/manus-storage/cream-luminous-orb_7f1b4b3d.jpg": "/assets/legacy/cream-luminous-orb_7f1b4b3d.jpg",
  "/manus-storage/cuadros_0fdc2e1c.jpg": "/assets/legacy/cuadros_0fdc2e1c.jpg",
  "/manus-storage/fe-espiritualidad_546155f2.png": "/assets/legacy/fe-espiritualidad_546155f2.png",
  "/manus-storage/instalacion-real-nubes_eee88aa5.jpg": "/assets/legacy/instalacion-real-nubes_eee88aa5.jpg",
  "/manus-storage/mastercard_fe030528.png": "/assets/legacy/mastercard_fe030528.png",
  "/manus-storage/mdfantasy-hero-pablo-jeremias_f72bc070.webp": "/assets/legacy/mdfantasy-hero-pablo-jeremias_f72bc070.webp",
  "/manus-storage/mdfantasy-instalacion-mejorada_ad830076.webp": "/assets/legacy/mdfantasy-instalacion-mejorada_ad830076.webp",
  "/manus-storage/navidad_c98eafac.jpg": "/assets/legacy/navidad_c98eafac.jpg",
  "/manus-storage/nube-cuadros_4f013700.jpg": "/assets/legacy/nube-cuadros_4f013700.jpg",
  "/manus-storage/nubes-portada-premium_f843e2ec.jpeg": "/assets/legacy/nubes-portada-premium_f843e2ec.jpeg",
  "/manus-storage/placas_f2df896b.jpg": "/assets/legacy/placas_f2df896b.jpg",
  "/manus-storage/plin_eba30021.png": "/assets/legacy/plin_eba30021.png",
  "/manus-storage/visa_1e1d1310.png": "/assets/legacy/visa_1e1d1310.png",
  "/manus-storage/yape_c149812e.png": "/assets/legacy/yape_c149812e.png",
};

const targets = [
  "client/index.html",
  "client/src/index.css",
  "client/src/pages/Home.tsx",
  "client/src/pages/Category.tsx",
  "client/src/pages/Navidad.tsx",
];

for (const target of targets) {
  let content = fs.readFileSync(target, "utf8");
  for (const [from, to] of Object.entries(replacements)) content = content.split(from).join(to);
  fs.writeFileSync(target, content);
}

console.log(`Replaced local Manus asset URLs in ${targets.length} source files.`);
