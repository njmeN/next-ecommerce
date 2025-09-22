"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { removeProductAction } from "@/lib/actions/account";
import { Trash2 } from "lucide-react";

export default function RemoveProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(() => {
      removeProductAction(null, { productId })
        .then(() => {
          toast.success("Product removed");
        })
        .catch(() => toast.error("Failed to remove product"));
    });
  };

  return (
    <div className="td_center">
         <button
      type="button"
      onClick={handleRemove}
      disabled={isPending}
      className=" table__trash"
    >
      {isPending ? "..." : <Trash2 />}
    </button>
    </div>
   
  );
}
