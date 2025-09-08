'use client';

import { useState } from "react";
import { placeOrder } from "@/lib/actions/orders";
import { toast } from "sonner";
import { useCart } from "@/lib/contexts/cart-context";
import { useRouter } from "next/navigation";
import { Box } from "lucide-react";

type Props = {
  defaultAddress: string;
};

export default function CartCheckoutForm({ defaultAddress }: Props) {
  const {refreshCart} = useCart();
  const [address, setAddress] = useState(defaultAddress || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("Please enter an address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await placeOrder(address);
      if (result.ok) {
        toast.success(result.message);
        setAddress("");
        await refreshCart(); 
        router.push("/account/orders");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form grid mt-8">
      <textarea
        name="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your shipping address"
        className="form__input textarea"
      />

      <button className="btn flex btn__md mt-4" disabled={isSubmitting}>
        <Box size={16} className="mr-1" />
        {isSubmitting ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}
