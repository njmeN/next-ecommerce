"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUserWishlist } from "@/lib/actions/wishlist";
import { WishlistItemWithProduct } from "@/lib/types/wishlist"; 

type WishlistContextType = {
  wishlist: WishlistItemWithProduct[];
  setWishlist: React.Dispatch<React.SetStateAction<WishlistItemWithProduct[]>>;
  loading: boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<WishlistItemWithProduct[]>([]);
  useEffect(() => {
    getUserWishlist()
      .then((items) => setWishlist(items))
      .catch(() => console.error("Failed to load wishlist"))
      .finally(() => setLoading(false));
  }, []);


  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}
