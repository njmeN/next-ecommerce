import z from "zod";

// lib/validation.ts


/** ---------- Helpers ---------- **/
export const NormalizedEmail = z.email("Invalid email address").trim().toLowerCase();

export const StrongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number");

export const Username = z.string().min(3, "Username must be at least 3 characters").max(50);


export function pickForm<T extends Record<string, string>>(formData: FormData, keys: (keyof T)[]) {
  return keys.reduce((acc, k) => {
    acc[k as string] = String(formData.get(k as string) ?? "");
    return acc;
  }, {} as Record<string, string>) as T;
}

/** ---------- Auth ---------- **/
export const LoginSchema = z.object({
  email: NormalizedEmail,
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginValues = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    username: Username,
    email: NormalizedEmail,
    password: StrongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export type RegisterValues = z.infer<typeof RegisterSchema>;

/** ---------- Account Tabs ---------- **/
// Update Profile (username)
export const UpdateUsernameSchema = z.object({
  username: Username,
});
export type UpdateUsernameValues = z.infer<typeof UpdateUsernameSchema>;

// Address
export const AddressSchema = z.object({
  address: z.string().min(5, "Minimum 5 characters").max(200),
});
export type AddressValues = z.infer<typeof AddressSchema>;

// Change Password
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: StrongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export type ChangePasswordValues = z.infer<typeof ChangePasswordSchema>;

/** ---------- Admin tab---------- **/
export const AdminAddProductSchema = z.object({
  title: z.string().min(1, "Required"),
  price: z.coerce.number().positive("Must be > 0"),
  availability: z.coerce.number().int().min(0, ">= 0"),
  description: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  sku: z.string().min(1, "Required"),
  images: z.array(
    z.string().refine((val) => {
      try {
        new URL(val)
        return true
      } catch {
        return false
      }
    }, {
      message: "Invalid image URL"
    })
  )
  .length(2, "Exactly 2 image URLs are required"),
});
export type AdminAddProductValues = z.infer<typeof AdminAddProductSchema>;


/** ---------- Admin: User Management ---------- **/

export const AdminUpdateRoleSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "admin"]),
});
export type AdminUpdateRoleValues = z.infer<typeof AdminUpdateRoleSchema>;

export const AdminUpdatePasswordSchema = z.object({
  id: z.string(),
  password: StrongPassword,
});
export type AdminUpdatePasswordValues = z.infer<typeof AdminUpdatePasswordSchema>;


/*--------review-------- */


// lib/validation/review.ts
export const reviewSchema = z.object({
  user: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  comment: z.string().min(1, "Comment is required"),
  rating: z
    .number()
    .min(1, { message: "Minimum rating is 1" })
    .max(5, { message: "Maximum rating is 5" }),
});

export type ReviewData = z.infer<typeof reviewSchema>;
