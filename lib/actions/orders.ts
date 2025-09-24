'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function placeOrder(address: string): Promise<{ ok: boolean; message: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, message: "You must be logged in to place an order." };
  }

  const userId = session.user.id;

  if (!address.trim()) {
    return { ok: false, message: "Address is required." };
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (!cartItems.length) {
      return { ok: false, message: "Your cart is empty." };
    }

    const products = cartItems.map((item) => ({
      id: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      images: item.product.images,
    }));

    const totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);


    await prisma.order.create({
      data: {
        userId,
        products,
        totalAmount,
        status: "Pending",
      },
    });

    await Promise.all(
      cartItems.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: {
            availability: {
              decrement: item.quantity,
            },
          },
        })
      )
    );

   
    await prisma.cartItem.deleteMany({ where: { userId } });


    await prisma.user.update({
      where: { id: userId },
      data: { address },
    });

   
    revalidatePath("/cart");
    revalidatePath("/account/orders");
   

    return { ok: true, message: "Order placed successfully." };
  } catch (error) {
    console.error("Order error:", error);
    return { ok: false, message: "Something went wrong. Try again." };
  }
}
