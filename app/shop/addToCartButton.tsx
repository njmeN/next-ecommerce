'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/contexts/cart-context'

export default function AddToCartButton({ productId }: { productId: string }) {
  const { addToCart } = useCart()

  return (
    <button onClick={() => addToCart(productId)} className="action__btn cart__btn" aria-label="Add to Cart">
      <ShoppingCart size={16} strokeWidth={1} />
    </button>
  )
}
