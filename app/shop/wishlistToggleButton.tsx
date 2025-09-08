"use client";

import { useWishlist } from "@/lib/contexts/wishlist-context";
import { addToWishlist, removeFromWishlist } from "@/lib/actions/wishlist";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import type { ProductStub } from "@/lib/types/wishlist";

type Props = {
  product: ProductStub;
};

export default function WishlistToggleButton({ product }: Props) {
  const { wishlist, setWishlist } = useWishlist();
  const productId = product.id;

  const isInWishlist = wishlist.some((item) => item.productId === productId);

  const toggleWishlist = async () => {
    if (isInWishlist) {
      const res = await removeFromWishlist(productId);
      if (res.ok) {
        setWishlist((prev) => prev.filter((item) => item.productId !== productId));
        toast.success("Removed from wishlist");
      }
    } else {
      const res = await addToWishlist(productId);
      if (res.ok) {
        setWishlist((prev) => [
          ...prev,
          { id: "", productId, userId: "", createdAt: new Date(), product },
        ]);
        toast.success("Added to wishlist");
      }
    }
  };

  return (
    <button onClick={toggleWishlist} className="action__btn action__icon" aria-label="wishlist">
      <Heart
        size={16}
        strokeWidth={1}
        fill={isInWishlist ? "red" : "none"}
        style={{ color: "hsl(154, 13%, 32%)" }}
      />
    </button>
  );
}
