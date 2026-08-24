import { beforeEach, describe, expect, it } from "vitest";
import { readSegedaCart } from "./segedaCart";

const storage = new Map<string, string>();

beforeEach(() => {
  storage.clear();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
    },
  });
});

describe("readSegedaCart", () => {
  it("conserva solo artículos con cantidades positivas", () => {
    storage.set("segeda-home-cart-v1", JSON.stringify([
      { id: "navidad-1", category: "navidad", title: "Modelo 1", image: "https://example.test/1.jpg", quantity: 2, unitPrice: 69 },
      { id: "nubes-2", category: "nubes", title: "Nube", image: "https://example.test/2.jpg", quantity: 0, unitPrice: 79 },
    ]));

    expect(readSegedaCart()).toEqual([
      { id: "navidad-1", category: "navidad", title: "Modelo 1", image: "https://example.test/1.jpg", quantity: 2, unitPrice: 69 },
    ]);
  });

  it("falla de forma segura si el almacenamiento tiene JSON inválido", () => {
    storage.set("segeda-home-cart-v1", "{invalido");

    expect(readSegedaCart()).toEqual([]);
  });
});
