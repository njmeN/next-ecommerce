'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/contexts/cart-context';

export default function QuantityInput({ productId, currentQuantity }: {
  productId: string;
  currentQuantity: number;
}) {
  const { updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(currentQuantity);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    setQuantity(currentQuantity); // Sync when context updates
    setShowUpdate(false);
  }, [currentQuantity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setQuantity(value);
    setShowUpdate(value !== currentQuantity);
  };

  const handleUpdate = () => {
    if (quantity > 0) {
      updateQuantity(productId, quantity);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <input
        type="number"
        className="quantity"
        value={quantity}
        onChange={handleChange}
        min={1}
      />
      {showUpdate && (
        <button className="btn btn__sm" onClick={handleUpdate}>
          Update
        </button>
      )}
    </div>
  );
}
