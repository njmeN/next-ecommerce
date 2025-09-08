'use client'

import { useCart } from "@/lib/contexts/cart-context";

import { useSession } from "next-auth/react";
import CheckoutForm from "./checkoutForm";

export default function CartCheckoutSection() {
  const { cart } = useCart();
  const { data: session } = useSession();

  const shipping = 10;
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const total = subtotal + shipping;

  return (
    <div className="cart__group grid">
        <div className="grid"> <h3 className="section__title">Cart Totals</h3>
      <div className="cart__total">
        
        <table className="cart__total-table">
          <tbody>
            <tr>
              <td>Cart Subtotal</td>
              <td>${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td>${shipping.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

      </div></div>
       
      <div className="mt-6">
          <CheckoutForm defaultAddress={session?.user?.address || ""} />
      </div>
    </div>
  );
}
