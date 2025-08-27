"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  AdminAddProductSchema,
  AdminAddProductValues,
  AdminUpdateRoleSchema,
  AdminUpdateRoleValues,
  ChangePasswordSchema,
  pickForm,
  UpdateUsernameSchema,
  AddressSchema,
} from "@/lib/validation";
import bcrypt from "bcryptjs";

type State = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

async function requireUserId() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function updateUsernameAction(data: { username: string }) {
  const session = await auth();
  const user = session?.user;
  if (!user) throw new Error("Unauthorized");

  const parsed = UpdateUsernameSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { username: parsed.data.username },
    });
    revalidatePath("/account/update-profile");
    return { ok: true, message: parsed.data.username };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Database error" };
  }
}

export async function updateAddressAction(prevState: State | null, formData: FormData): Promise<State> {
  const userId = await requireUserId();
  const parsed = AddressSchema.safeParse({ address: String(formData.get("address") ?? "") });
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }
  try {
    await prisma.user.update({ where: { id: userId }, data: { address: parsed.data.address } });
    revalidatePath("/account/address");
    return { ok: true, message: "Address updated successfully" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Database error" };
  }
}

export async function changePasswordAction(data: { currentPassword: string; newPassword: string; confirmPassword: string }) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const parsed = ChangePasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const { currentPassword, newPassword } = parsed.data;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { password: true } });

    if (!user?.password) {
      const newHash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({ where: { id: userId }, data: { password: newHash } });
      revalidatePath("/account/change-password");
      return { ok: true, message: "Password created successfully" };
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return { ok: false, errors: { currentPassword: ["Incorrect current password"] } };
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { password: newHash } });
    revalidatePath("/account/change-password");
    return { ok: true, message: "Password updated successfully" };
  } catch (error) {
    console.error(error);
    return { ok: false, message: "Database error" };
  }
}

export async function changeOrderStatusAction(formData: FormData) {
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== "admin") throw new Error("Unauthorized");

  const orderId = formData.get("orderId") as string;
  const newStatus = formData.get("status") as string;
  if (!orderId || !newStatus) return;

  try {
    await prisma.order.update({ where: { id: orderId }, data: { status: newStatus } });
    revalidatePath("/account/admin/orders");
  } catch (error) {
    console.error(error);
  }
}

export async function updateProductAvailabilityAction(_prev: unknown, payload: { productId: string; availability: number }) {
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== "admin") throw new Error("Unauthorized");

  const { productId, availability } = payload;
  if (!productId || isNaN(availability)) return;

  try {
    await prisma.product.update({ where: { id: productId }, data: { availability } });
    revalidatePath("/account/admin/products");
  } catch (error) {
    console.error(error);
  }
}

export async function removeProductAction(_prev: unknown, payload: { productId: string }) {
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== 'admin') throw new Error('Unauthorized');
  const { productId } = payload;
  if (!productId) return;

  try {
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath('/account/admin/products');
  } catch (error) {
    console.error(error);
  }
}

export async function addProductAction(_: any, data: AdminAddProductValues) {
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== "admin") throw new Error("Unauthorized");

  const parsed = AdminAddProductSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid input");

  try {
    await prisma.product.create({ data: parsed.data });
    revalidatePath("/account/admin/products");
  } catch (error) {
    console.error(error);
  }
}

export async function deleteUser(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) throw new Error('User ID is required');

  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/account/users-list');
  } catch (error) {
    console.error(error);
  }
}

export async function updateUserRole(formData: FormData) {
  const values = pickForm<AdminUpdateRoleValues>(formData, ['id', 'role']);
  const parsed = AdminUpdateRoleSchema.safeParse(values);
  if (!parsed.success) throw new Error('Invalid role input');

  try {
    await prisma.user.update({ where: { id: parsed.data.id }, data: { role: parsed.data.role } });
    revalidatePath('/account/users-list');
  } catch (error) {
    console.error(error);
  }
}
