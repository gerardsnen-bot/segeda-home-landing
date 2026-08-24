export const MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"] as const;

export function getImageUploadError(file: Pick<File, "type" | "size">) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return "Selecciona una imagen JPG, PNG, WEBP o SVG.";
  }
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) return "La imagen no puede superar los 10 MB.";
  return null;
}
