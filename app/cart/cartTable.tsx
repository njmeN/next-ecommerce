'use client';

import { useCart } from "@/lib/contexts/cart-context";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import QuantityInput from "./quantityInput";
import Loading from "@/components/common/loading";

export function CartTable() {
  const { cart, removeFromCart, loading  } = useCart();
  const [subtotal, setSubtotal] = useState(0);
  const shipping = 10;

  useEffect(() => {
    const sub = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    setSubtotal(sub);
  }, [cart]);

  const total = subtotal + shipping;

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

      <div className="cart__group grid">
        <div className="cart__total">
          <h3 className="section__title">Cart Totals</h3>
          <table className="cart__total-table">
            <tbody>
              <tr>
                <td>Cart Subtotal</td>
                <td>${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Shipping</td>
                <td>${shipping}</td>
              </tr>
              <tr>
                <td>Total</td>
                <td>${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <button className="btn flex btn__md">
            <i className="fi fi-rs-box-alt"></i>Proceed To Checkout
          </button>
        </div>
      </div>
    </>
  );
}
