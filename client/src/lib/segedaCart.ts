/**
 * Carrito persistente de Segeda Home: conserva selecciones del catálogo en localStorage
 * y sincroniza el contador entre las vistas de preventa y catálogo principal.
 */
import { useEffect, useMemo, useState } from "react";

export type SegedaCartItem = {
  id: string;
  category: string;
  title: string;
  image: string;
  quantity: number;
  unitPrice: number;
};

const STORAGE_KEY = "segeda-home-cart-v1";
const CHANGE_EVENT = "segeda-cart-updated";

export function readSegedaCart(): SegedaCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => item && item.quantity > 0) : [];
  } catch {
    return [];
  }
}

function writeSegedaCart(items: SegedaCartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.filter((item) => item.quantity > 0)));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useSegedaCart() {
  const [items, setItems] = useState<SegedaCartItem[]>(readSegedaCart);

  useEffect(() => {
    const synchronize = () => setItems(readSegedaCart());
    window.addEventListener("storage", synchronize);
    window.addEventListener(CHANGE_EVENT, synchronize);
    return () => {
      window.removeEventListener("storage", synchronize);
      window.removeEventListener(CHANGE_EVENT, synchronize);
    };
  }, []);

  const updateCart = (updater: (current: SegedaCartItem[]) => SegedaCartItem[]) => {
    const next = updater(readSegedaCart());
    writeSegedaCart(next);
    setItems(next.filter((item) => item.quantity > 0));
  };

  const removeItem = (id: string) => updateCart((current) => current.filter((item) => item.id !== id));
  const quantity = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0), [items]);

  return { items, quantity, total, updateCart, removeItem };
}
