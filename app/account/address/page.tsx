"use client";

import { useActionState, useTransition } from "react";
import { updateAddressAction } from "@/lib/actions/account";
import { useSessionContext } from "@/lib/contexts/session-context";
import Link from "next/link";

export default function AddressPage() {
  const [state, formAction] = useActionState(updateAddressAction, null);
  const { user } = useSessionContext();
  const [isPending, startTransition] = useTransition();

  return (
    <section>
      
      <div className="tab__content active-tab">
      <h3 className="tab__header">Shipping Address</h3>
      <div className="tab__body">
        <form  action={(formData) => {
            startTransition(() => formAction(formData));
          }} className="form grid">
          <input
            name="address"
            className="form__input"
            placeholder="Address"
            defaultValue={user?.address || ""}
          />
          {state?.errors?.address && (
            <p className="error">{state.errors.address[0]}</p>
          )}
          {state?.ok && <p className="success">{state.message}</p>}
          <button className="btn btn__md" type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save"}</button>
        </form>
      </div>
    </div>
    </section>
    
  );
}
