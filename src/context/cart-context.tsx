"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItemData {
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  sku: string;
  priceInKobo: number;
  image: string;
  quantity: number;
  maxStock: number;
  isMadeToOrder: boolean;
  leadTimeDays?: number;
}

interface CartContextType {
  items: CartItemData[];
  addItem: (item: Omit<CartItemData, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotalInKobo: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "faavy_luxury_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load cart from storage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage on update
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Could not save cart to storage", e);
    }
  }, [items, isHydrated]);

  const addItem = (
    itemData: Omit<CartItemData, "quantity">,
    quantity = 1
  ) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.variantId === itemData.variantId
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        // Cap at maxStock if not made-to-order
        const effectiveQty = itemData.isMadeToOrder
          ? newQty
          : Math.min(newQty, itemData.maxStock);

        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: effectiveQty,
        };
        return updated;
      }

      const initialQty = itemData.isMadeToOrder
        ? quantity
        : Math.min(quantity, Math.max(1, itemData.maxStock));

      return [...prev, { ...itemData, quantity: initialQty }];
    });

    setIsCartOpen(true);
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId) {
          const effectiveQty = item.isMadeToOrder
            ? quantity
            : Math.min(quantity, item.maxStock);
          return { ...item, quantity: effectiveQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalInKobo = items.reduce(
    (sum, item) => sum + item.priceInKobo * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotalInKobo,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
