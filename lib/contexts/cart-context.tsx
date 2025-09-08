'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCartItems } from '../actions/cart';
import {CartItem, type CartContextType} from '../types/cart'
import { toast } from 'sonner';
import { addToCart as addToCartAction, removeFromCart as removeFromCartAction,  updateCartQuantity as updateQuantityAction} from '../actions/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    getCartItems().then((items) => {
      setCart(items);
      setLoading(false);
    });
  }, []);
  

async function addToCart(productId: string) {
  const result = await addToCartAction(productId);

  if (result.ok) {
    toast.success(result.message);
    const items = await getCartItems();
    setCart(items);
  } else {
    toast.error(result.message);
    if (result.message.toLowerCase().includes("logged in")) {
      toast.error("Please log in to add items to your cart", {
        action: {
          label: "Login",
          onClick: () => window.location.href = "/login"
        }
      });
      
    }
  }
}

async function removeFromCart(productId: string) {
  const result = await removeFromCartAction(productId)
  if (result.ok) {
    toast.success(result.message)
    const items = await getCartItems()
    setCart(items)
  } else {
    toast.error(result.message)
  }
}

async function updateQuantity(productId: string, quantity: number) {
  const result = await updateQuantityAction(productId, quantity);

  if (result.ok) {
    toast.success(result.message);
    const items = await getCartItems();
    setCart(items);
  } else {
    toast.error(result.message);
  }
}

async function refreshCart() {
  try {
    const items = await getCartItems();
    setCart(items);
  } catch (error) {
    console.error("Failed to refresh cart:", error);
    toast.error("Something went wrong while updating your cart.");
  }
}



  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQuantity, loading, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
