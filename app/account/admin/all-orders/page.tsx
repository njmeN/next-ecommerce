import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { changeOrderStatusAction } from "@/lib/actions/account";
import { type Order, type User } from '@prisma/client';


export default async function AdminOrdersPage() {
  type OrderWithUserEmail = Order & { user: { email: string } };
  const session = await auth();
  const user = session?.user;

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  let orders: OrderWithUserEmail[] = [];
let ordersError = false;

try {
  orders = await prisma.order.findMany({
    include: {
      user: { select: { email: true } },
    },
    orderBy: { date: 'desc' },
  });
} catch (err) {
  console.error('Failed to fetch orders:', err);
  ordersError = true;
}

  return (
    <div className="tab__content active-tab">
      <h3 className="tab__header">All Orders</h3>
      <div className="tab__body">
      <div className="table__container">
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
                  <form action={changeOrderStatusAction}>
                    <input type="hidden" name="orderId" value={order.id} />
                    <select
                      name="status"
                      defaultValue={order.status}
                      onChange={(e) => e.currentTarget.form?.requestSubmit()}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </form>
                </td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>${order.totalAmount}</td>
                <td>
                  {Array.isArray(order.products)
                    ? order.products.map((p: any) => p.productId).join(", ")
                    : "No products"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
