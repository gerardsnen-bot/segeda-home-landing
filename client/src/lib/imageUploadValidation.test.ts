import { describe, expect, it } from "vitest";
import { MAX_IMAGE_UPLOAD_BYTES, getImageUploadError } from "./imageUploadValidation";

describe("getImageUploadError", () => {
  it("acepta formatos de imagen permitidos dentro del límite", () => {
    expect(getImageUploadError({ type: "image/png", size: MAX_IMAGE_UPLOAD_BYTES })).toBeNull();
    expect(getImageUploadError({ type: "image/svg+xml", size: 1024 })).toBeNull();
  });

  it("rechaza formatos no compatibles y archivos demasiado grandes", () => {
    expect(getImageUploadError({ type: "image/gif", size: 1024 })).toMatch(/JPG, PNG, WEBP o SVG/);
    expect(getImageUploadError({ type: "image/jpeg", size: MAX_IMAGE_UPLOAD_BYTES + 1 })).toMatch(/10 MB/);
  });
});
