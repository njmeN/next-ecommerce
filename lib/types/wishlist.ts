import type { WishlistItem, Product } from "@prisma/client";

export type ProductStub = Pick<Product, "id" | "title" | "price" | "images">;

export type WishlistItemWithProduct = WishlistItem & {
  product: ProductStub;
};

export type WishlistContextType = {
  wishlist: WishlistItemWithProduct[];
  setWishlist: React.Dispatch<React.SetStateAction<WishlistItemWithProduct[]>>;
  loading: boolean;
};
