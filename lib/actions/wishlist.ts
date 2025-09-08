"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function addToWishlist(productId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { ok: false, message: "You must be logged in." };
  }

  try {
    await prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });

    return { ok: true, message: "Added to wishlist." };
  } catch (error) {
    if ((error as any)?.code === "P2002") {
      // Unique constraint violation
      return { ok: false, message: "Already in wishlist." };
    }

    console.error("Error adding to wishlist:", error);
    return { ok: false, message: "Something went wrong." };
  }
}

export async function removeFromWishlist(productId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { ok: false, message: "You must be logged in." };
  }

  try {
    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return { ok: true, message: "Removed from wishlist." };
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return { ok: false, message: "Something went wrong." };
  }
}

export async function getUserWishlist() {
    const session = await auth();
    const userId = session?.user?.id;
  
    if (!userId) return [];
  
    try {
      const items = await prisma.wishlistItem.findMany({
        where: { userId },
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      return items;
    } catch (error) {
      console.error("Failed to fetch wishlist items");
      return [];
    }
  }
  