'use client';

import { useCart } from "@/lib/contexts/cart-context";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import QuantityInput from "./quantityInput";
import Loading from "@/components/common/loading";

export function CartTable() {
  const { cart, removeFromCart, loading  } = useCart();

  return (
    <>
      <div className="table__container">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
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
            cart.map((item) => (
              <tr key={item.id}>
                <td>
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.title}
                    width={60}
                    height={60}
                    className="table__img"
                    loading="lazy"
                  />
                </td>
                <td>
                  <Link href={`/product/${item.product.id}`} className="table__title">
                    {item.product.title}
                  </Link>
                </td>
                <td>${item.product.price}</td>
                <td>
                <QuantityInput
  productId={item.product.id}
  currentQuantity={item.quantity}
/>
</td>
                <td>${(item.quantity * item.product.price).toFixed(2)}</td>
                <td>
                  <Trash2
                    size={18}
                    className="table__trash"
                    onClick={() => removeFromCart(item.productId)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
    </>
  );
}
