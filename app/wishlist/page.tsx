"use client";

import { useWishlist } from "@/lib/contexts/wishlist-context";
import { useCart } from "@/lib/contexts/cart-context";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2 } from "lucide-react";
import noImage from "@/public/images/no-image-svgrepo-com.svg";
import { removeFromWishlist } from "@/lib/actions/wishlist";
import { toast } from "sonner";
import Loading from "@/components/common/loading";


export default function WishlistPage() {
  const { wishlist, setWishlist,loading } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId);
  };

  const handleRemove = async (productId: string) => {
    const result = await removeFromWishlist(productId);
    if (result.ok) {
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
      toast.success("Removed from wishlist");
    } else {
      toast.error(result.message || "Failed to remove item from wishlist");
    }
  };

  return (
    <section>
      {/* Breadcrumb */}
      <section className="breadcrumb">
        <ul className="breadcrumb__list flex container">
          <li><Link href="/" className="breadcrumb__link">Home</Link></li>
          <li><span className="breadcrumb__link">{">"}</span></li>
          <li><span className="breadcrumb__link">Wishlist</span></li>
        </ul>
      </section>

      {/* Wishlist Table */}
      <section className="wishlist section__lg container">
        <div className="table__container">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Action</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
               {loading ? 
                        <tr>
                          <td></td>
                          <td></td>
                          <td>  <Loading/></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                       : 
              wishlist.length > 0 ? (
                wishlist.map(({ product }) => (
                  <tr key={product.id}>
                    <td>
                      <Image
                        src={product?.images?.[0] || noImage}
                        alt={product.title}
                        width={70}
                        height={70}
                        className="table__img"
                      />
                    </td>
                    <td>
                      <h3 className="table__title">{product.title}</h3>
                    </td>
                    <td>
                      <span className="table__price">${product.price}</span>
                    </td>
                    <td>
                      <span className="table__stock">In Stock</span>
                    </td>
                    <td>
                      <button
                        className="btn btn__sm"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        <ShoppingCart size={14} className="mr-1" /> Add to cart
                      </button>
                    </td>
                    <td>
                      <Trash2
                        size={18}
                        className="table__trash"
                        onClick={() => handleRemove(product.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No items in the wishlist
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
