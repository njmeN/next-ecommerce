'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/contexts/cart-context';
import { toast } from 'sonner';

type Props = {
  productId: string;
  currentQuantity: number;
  max?: number;
};

export default function QuantityInput({ productId, currentQuantity, max }: Props) {
  const { updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(currentQuantity);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    setQuantity(currentQuantity); 
    setShowUpdate(false);
  }, [currentQuantity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 1;

    
    if (max && value > max) {
      toast.error(`Only ${max} in stock.`);
      setQuantity(max);
      setShowUpdate(max !== currentQuantity);
    } else {
      setQuantity(value);
      setShowUpdate(value !== currentQuantity);
    }
  };

  const handleUpdate = () => {
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    updateQuantity(productId, quantity);
    setShowUpdate(false);
  };

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <input
        type="number"
        className="quantity"
        value={quantity}
        onChange={handleChange}
        min={1}
        max={max}
      />
      {showUpdate && (
        <button className="btn btn__sm" onClick={handleUpdate}>
          Update
        </button>
      )}
    </div>
  );
}
