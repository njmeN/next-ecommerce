'use client'

import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useSessionContext } from "@/lib/contexts/session-context";
import { changePasswordAction } from "@/lib/actions/account";
import {
  ChangePasswordSchema,
  type ChangePasswordValues,
} from "@/lib/validation";
import Loading from "@/components/common/loading";

export default function ChangePasswordPage() {
  const { user, setUser } = useSessionContext();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ChangePasswordValues) {
    startTransition(async () => {
      try {
        const res = await changePasswordAction(data);

        if (res.ok) {
          setSuccessMessage(res.message ?? "Password updated successfully");
          setErrorMessage(null);
          reset();

          
          if (user) {
            setUser({
              ...user
            });
          }
          await update();
        } else {
          setSuccessMessage(null);
          setErrorMessage(
            res.errors
              ? Object.values(res.errors).flat().join(", ")
              : "An error occurred",
          );
        }
      } catch (error) {
        setSuccessMessage(null);
        setErrorMessage("An unexpected error occurred");
      }
    });
  }

 
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setErrorMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  if (!user) {
    return <Loading/>;

  }

  return (
    <div className="tab__content active-tab">
      <h3 className="tab__header">Change Password</h3>
      <div className="tab__body">
        <form onSubmit={handleSubmit(onSubmit)} className="form grid">
          <input
            type="password"
            {...register("currentPassword")}
            placeholder="Current Password"
            className="form__input"
            disabled={isPending}
          />
          {errors.currentPassword && (
            <p className="error">{errors.currentPassword.message}</p>
          )}

          <input
            type="password"
            {...register("newPassword")}
            placeholder="New Password"
            className="form__input"
            disabled={isPending}
          />
          {errors.newPassword && (
            <p className="error">{errors.newPassword.message}</p>
          )}

          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm New Password"
            className="form__input"
            disabled={isPending}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword.message}</p>
          )}

          {successMessage && <p className="success">{successMessage}</p>}
          {errorMessage && <p className="error">{errorMessage}</p>}

          <button type="submit" className="btn btn__md" disabled={isPending}>
            {isPending ? "Saving..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}