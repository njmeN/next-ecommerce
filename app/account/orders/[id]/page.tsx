import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import noImage from "@/public/images/no-image-svgrepo-com.svg";

type Props = {
  params: Promise<{ id: string }>;  
};

export default async function UserOrderDetailPage({ params }: Props) {
  const { id } = await params;  

  const session = await auth();
  if (!session?.user) return notFound();

  let order;
  try {
    order = await prisma.order.findUnique({
      where: {
        id, 
        userId: session.user.id,
      },
    });
  } catch (err) {
    return <p className="container error">Failed to fetch orders</p>;
  }

  if (!order) return notFound();

  const items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    images?: string[]; 
  }[] = order.products as any;

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
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <Image
                    src={
                      item.images?.[0] || noImage
                    }
                    alt={item.title}
                    width={60}
                    height={60}
                    className="table__img"
                    loading="lazy"
                    unoptimized
                  />
                </td>
                <td>{item.title}</td>
                <td>${item.price}</td>
                <td>{item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}