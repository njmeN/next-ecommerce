import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { type Order, type User } from "@prisma/client";
import Link from "next/link";

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
    return <p className="container error">Failed to fetch orders</p>
  }

  return (
    <div className="tab__content active-tab" id="orders">
      <h3 className="tab__header">Your Orders</h3>

      <div className="tab__body">
        {userError || !user?.orders?.length ? (
          <p>No orders found.</p>
        ) : (
          <table className="placed__order-table">
            <thead>
              <tr>
                <th>Orders</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Products</th>
              </tr>
            </thead>
            <tbody>
              {user.orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 6).toUpperCase()}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <Link href={`/account/orders/${order.id}`} className="view__order">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
