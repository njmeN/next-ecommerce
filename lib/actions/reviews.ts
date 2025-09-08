
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { type ReviewData } from "../types/review";

export async function addReview(productId: string, data: ReviewData) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { ok: false, message: "You must be logged in to submit a review." };
  }

  if (!data.user || !data.email || !data.comment || !data.rating) {
    return { ok: false, message: "All fields are required." };
  }

  if (data.rating < 1 || data.rating > 5) {
    return { ok: false, message: "Rating must be between 1 and 5." };
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { ratingSum: true, ratingCount: true },
    });

    if (!product) {
      return { ok: false, message: "Product not found." };
    }

    const newSum = product.ratingSum + data.rating;
    const newCount = product.ratingCount + 1;
    const newAvg = newSum / newCount;

    await prisma.$transaction([
      prisma.review.create({
        data: {
          ...data,
          productId,
        },
      }),
      prisma.product.update({
        where: { id: productId },
        data: {
          ratingSum: newSum,
          ratingCount: newCount,
          rating: newAvg,
        },
      }),
    ]);

    return { ok: true, message: "Review submitted successfully." };
  } catch (error) {
    console.error("Error adding review:", error);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
