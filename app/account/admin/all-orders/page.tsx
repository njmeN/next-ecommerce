
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { type Order, type User } from "@prisma/client";
import OrderStatusForm from "./orderStatueForm";
import Link from "next/link";

export default async function AdminOrdersPage() {
  type OrderWithUser = Order & { user: { email: string } };

  const session = await auth();
  const user = session?.user;

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  let orders: OrderWithUser[] = [];


  try {
    orders = await prisma.order.findMany({
      include: {
        user: { select: { email: true } },
      },
      orderBy: { date: "desc" },
    });
  } catch (err) {
    return <p className="container error">failed to fetch orders</p>;
  }

  return (
    <div className="tab__content active-tab">
      <h3 className="tab__header">All Orders</h3>

      <div className="tab__body table__container">
        
          <table className="placed__order-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Status</th>
                <th>Date</th>
                <th>Total</th>
                <th>Products</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.user.email}</td>
                  <td>
  <OrderStatusForm orderId={order.id} currentStatus={order.status} />
</td>

                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                  <Link href={`/account/admin/all-orders/${order.id}`} className="view__order">
    View
  </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        
      </div>
    </div>
  );
}
