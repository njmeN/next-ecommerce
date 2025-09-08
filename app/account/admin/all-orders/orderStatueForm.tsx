
'use client';

import { useTransition } from "react";
import { changeOrderStatusAction } from "@/lib/actions/account";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";

type Props = {
  orderId: string;
  currentStatus: string;
};

export default function OrderStatusForm({ orderId, currentStatus }: Props) {
  const [pending, startTransition] = useTransition();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const formData = new FormData();
    formData.append("orderId", orderId);
    formData.append("status", e.target.value);

    const res = await changeOrderStatusAction(formData);
    if (res?.ok) toast.success("Order status updated");
    else toast.error("Failed to update order status");

    startTransition(() => {
      changeOrderStatusAction(formData);
    });
  };

  return (
    <div className="select-wrapper">
        <select
      name="status"
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={pending}
      className="custom-select form__input"
    >
      <option value="Pending">Pending</option>
      <option value="Shipped">Shipped</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>
    <ChevronDown className="select-icon" size={18} />
    </div>
    
  );
}
