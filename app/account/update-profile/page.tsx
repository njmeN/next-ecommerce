// app/account/update-profile/page.tsx
"use client";

import { useSessionContext } from "@/lib/contexts/session-context";
import { updateUsernameAction } from "@/lib/actions/account";
import { UpdateUsernameSchema, type UpdateUsernameValues } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function UpdateProfilePage() {
  const { user, setUser } = useSessionContext();
  const { update } = useSession(); // Get update method from useSession
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Added for error handling
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUsernameValues>({
    resolver: zodResolver(UpdateUsernameSchema),
    defaultValues: {
      username: user?.username ?? "",
    },
  });

  async function onSubmit(data: UpdateUsernameValues) {
    startTransition(async () => {
      try {
        const res = await updateUsernameAction(data);

        if (res.ok && res.message) {
          // Update form state
          reset({ username: res.message });
          setSuccessMessage("Saved successfully");
          setErrorMessage("");

          // Update NextAuth session
          await update({ username: res.message });

          // Update SessionContext
          if (user) {
            setUser({
              ...user,
              username: res.message,
            });
          }

          // Refresh page to ensure server components are updated
          router.refresh();
        } else if (res.errors) {
          setErrorMessage("Failed to update username: " + JSON.stringify(res.errors));
          setSuccessMessage("");
        }
      } catch (error) {
        setErrorMessage("An error occurred while updating the username");
        setSuccessMessage("");
      }
    });
  }

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  if (!user) {
    return <div className="tab__content active-tab">Loading...</div>;
  }

  return (
    <div className="tab__content active-tab">
      <h3 className="tab__header">Update Profile</h3>
      <div className="tab__body">
        <form onSubmit={handleSubmit(onSubmit)} className="form grid">
          <input
            {...register("username")}
            className="form__input"
            placeholder="Username"
            disabled={isPending}
          />
          {errors.username && <p className="error">{errors.username.message}</p>}
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