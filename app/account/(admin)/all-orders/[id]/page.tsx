import { prisma } from "@/lib/prisma";
import noimg from "@/public/images/no-image-svgrepo-com.svg";
import Image from "next/image";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;  
}) {
  
  const { id } = await params;  
  
  const order = await prisma.order.findUnique({ where: { id } }); 
  if (!order) return <p className="container error">failed to fetch orders</p>;
  
  const products = Array.isArray(order.products) ? order.products : [];

  return (
    <div className="tab__content active-tab">
      <h3 className="tab__header">Order #{order.id}</h3>
      <div className="tab__body table__container">
        <table className="placed__order-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any, idx: number) => (
              <tr key={idx}>
                <td>
                  <Image
                    src={p.images?.[0] ?? noimg}
                    alt={p.title}
                    width={60}
                    height={60}
                    className="table__img"
                    loading="lazy"
                    unoptimized
                  />
                </td>
                <td>{p.title}</td>
                <td>${p.price}</td>
                <td>{p.quantity}</td>
                <td>${(p.price * p.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}