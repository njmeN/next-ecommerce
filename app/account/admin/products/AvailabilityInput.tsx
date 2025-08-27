"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateProductAvailabilityAction } from "@/lib/actions/account";

export default function AvailabilityInput({
  productId,
  initialAvailability,
}: {
  productId: string;
  initialAvailability: number;
}) {
  const [availability, setAvailability] = useState(initialAvailability);
  const [showUpdate, setShowUpdate] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    setAvailability(newVal);
    setShowUpdate(newVal !== initialAvailability);
  };

  const handleUpdate = () => {
    startTransition(() => {
      updateProductAvailabilityAction(null, {
        productId,
        availability,
      })
        .then(() => {
          toast.success("Availability updated");
          setShowUpdate(false);
        })
        .catch(() => toast.error("Failed to update availability"));
    });
  };

  return (
    <div className="td_center ">
      <input
        type="number"
        value={availability}
        onChange={handleChange}
        className="quantity"
        style={{ width: "80px" }}
        disabled={isPending}
      />
      {showUpdate && (
        <button
          type="button"
          onClick={handleUpdate}
          disabled={isPending}
          className="btn btn__sm"
        >
          {isPending ? "Updating..." : "Update"}
        </button>
      )}
    </div>
  );
}
