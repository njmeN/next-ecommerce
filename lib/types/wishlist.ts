import { WishlistItem, Product } from "@prisma/client";

export type WishlistItemWithProduct = WishlistItem & {
  product: Product;
};
