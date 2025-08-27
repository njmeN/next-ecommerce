// app/account/orders/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { type Order, type User } from '@prisma/client';

export default async function OrdersPage() {
  const session = await auth();
  if (!session) return null;
  type UserWithOrders = User & { orders: Order[] };

  let user: UserWithOrders | null = null;
  let userError = false;
  
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { orders: true },
    });
  } catch (err) {
    console.error('Failed to fetch user info:', err);
    userError = true;
  }



  return (
    <div className="tab__content active-tab">
      <h3 className="tab__header">Your Orders</h3>
      <div className="tab__body">
        <ul>
          {user?.orders?.map(order => (
            <li key={order.id}>
              {order.id} - {order.status} - {order.totalAmount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
