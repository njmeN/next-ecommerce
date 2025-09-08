import { Product } from "@prisma/client";

export type CartItem = {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
};

export type CartContextType = {
  cart: CartItem[];
  setCart: (items: CartItem[]) => void;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  loading:boolean;
  refreshCart:()=>Promise<void>;
};

export type CartActionResult = {
    ok: boolean;
    message: string;
   
  };