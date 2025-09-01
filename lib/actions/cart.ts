// app/actions/cart.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";


export async function getCartItems() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  return items.map(item => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: item.product,
  }));
}

/*--------add to cart--------*/
export async function addToCart(productId: string): Promise<{ ok: boolean; message: string }> {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { ok: false, message: "You must be logged in to add to cart" };
     
    }
  
    try {
      const existing = await prisma.cartItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
        include: { product: true },
      });
  
      if (existing) {
        if (existing.quantity >= existing.product.availability) {
          return { ok: false, message: "Product is out of stock" };
        }
  
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: { increment: 1 } },
        });
  
        return { ok: true, message: "Cart updated" };
      }
  
      await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity: 1,
        },
      });
  
      return { ok: true, message: "Product added to cart" };
    } catch (err) {
      console.error("Add to cart error", err);
      return { ok: false, message: "Something went wrong" };
    }
  }


  export async function removeFromCart(productId: string) {
    const session = await auth()
    const userId = session?.user?.id
  
    if (!userId) {
      return { ok: false, message: "You must be logged in to remove from cart" }
    }
  
    try {
      await prisma.cartItem.deleteMany({
        where: {
          userId,
          productId,
        },
      })
  
      return { ok: true, message: "Item removed from cart" }
    } catch (error) {
      console.error("Remove from cart failed:", error)
      return { ok: false, message: "Failed to remove item from cart" }
    }
  }


  export async function updateCartQuantity(productId: string, quantity: number) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { ok: false, message: "Unauthorized" };
  
    if (quantity <= 0) return { ok: false, message: "Quantity must be at least 1" };
    try{
      const existing = await prisma.cartItem.findUnique({
        where: {
          userId_productId: { userId, productId },
        },
        include: { product: true },
      });
    
      if (!existing) return { ok: false, message: "Cart item not found" };
    
      if (quantity > existing.product.availability) {
        return { ok: false, message: "Quantity exceeds product availability" };
      }
      
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity },
      });
    
      return { ok: true, message: "Cart updated" };
    }catch (error) {
      console.error("Updating cart failed:", error)
      return { ok: false, message: "Failed to update cart" }
    }
  
    
  }
  