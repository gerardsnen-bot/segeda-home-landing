export function toCatalogSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function createProductSku(name: string, timestamp = Date.now()) {
  const prefix = toCatalogSlug(name).slice(0, 16).toUpperCase() || "MDF";
  return `${prefix}-${String(timestamp).slice(-6)}`;
}
