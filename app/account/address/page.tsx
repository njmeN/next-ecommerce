'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, useEffect } from "react";
import { useSessionContext } from "@/lib/contexts/session-context";
import { updateAddressAction } from "@/lib/actions/account";
import { AddressSchema, type AddressValues } from "@/lib/validation";

export default function UpdateAddressPage() {
  const { user, setUser } = useSessionContext();
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressValues>({
    resolver: zodResolver(AddressSchema),
    defaultValues: { address: user?.address ?? "" },
  });

  // Sync form with latest user data
  useEffect(() => {
    if (user?.address) {
      reset({ address: user.address });
    }
  }, [user, reset]);

  const onSubmit = async (data: AddressValues) => {
    startTransition(async () => {
      try {
        const res = await updateAddressAction(null, data);

        if (res.ok) {
          setSuccessMessage(res.message || "Address updated successfully");
          setErrorMessage("");

          // Update context
          if (user) {
            setUser({
              ...user,
              id: user.id!,  
              address: data.address,
            });
          }

          reset({ address: data.address });

          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMessage(""), 3000);
        } else {
          setErrorMessage(res.message || "Failed to update address");
          setSuccessMessage("");
        }
      } catch (err) {
        setErrorMessage("An unexpected error occurred");
        setSuccessMessage("");
      }
    });
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="tab__content active-tab">
      <h3 className="tab__header">Shipping Address</h3>
      <div className="tab__body">
        <form onSubmit={handleSubmit(onSubmit)} className="form grid">
          <input
            {...register("address")}
            className="form__input"
            placeholder="Address"
            disabled={isPending}
          />
          {errors.address && <p className="error">{errors.address.message}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}
          <button className="btn btn__md" type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
