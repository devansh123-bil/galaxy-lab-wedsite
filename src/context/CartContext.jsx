import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("galaxyLabCart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("galaxyLabCart", JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const addItem = (product, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [
          ...current,
          {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            description: product.description,
            category: product.category,
            image_url: product.image_url,
            quantity
          }
        ];
      });
    };

    const updateQuantity = (id, quantity) => {
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, Number(quantity) || 1) } : item))
      );
    };

    const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id));
    const clearCart = () => setItems([]);
    const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return { items, addItem, updateQuantity, removeItem, clearCart, total, count };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
