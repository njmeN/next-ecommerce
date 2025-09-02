'use client'

import { useCart } from '@/lib/contexts/cart-context'
import QuantityInput from '@/app/cart/quantityInput'
import { ShoppingCart } from 'lucide-react'

export default function ProductCartControls({
  productId,
  max,
}: {
  productId: string
  max: number
}) {
  const { cart, addToCart, removeFromCart } = useCart()
  const itemInCart = cart.find((item) => item.product.id === productId)

  if (itemInCart) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <QuantityInput
          productId={productId}
          currentQuantity={itemInCart.quantity}
          max={max}
        />
        <button
          className="btn btn__sm"
          onClick={() => removeFromCart(productId)}
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <button className="btn btn__sm" onClick={() => addToCart(productId)}>
      <ShoppingCart size={16} style={{ marginRight: '0.5rem' }} />
      Add to Cart
    </button>
  )
}
