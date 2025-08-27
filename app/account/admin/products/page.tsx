import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AddProductForm from "./addProducts";
import noimg from "@/public/images/no-image-svgrepo-com.svg";
import { type Product } from "@prisma/client";

import AvailabilityInput from "@/app/account/admin/products/AvailabilityInput";
import RemoveProductButton from "./RemoveProductButton";

export default async function AdminProductsPage() {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  let products: Product[] = [];
  let productsError = false;

  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Failed to fetch products:", err);
    productsError = true;
  }

  return (
    <div className="tab__content active-tab">
      <h3 className="tab__header">Edit Products</h3>

      <div className="tab__body table__container">
        <table className="placed__order-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Available</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.images?.[0] ?? noimg}
                      alt={product.title}
                      className="table__img"
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>${product.price}</td>
                  <td className="">
                  <AvailabilityInput
    productId={product.id}
    initialAvailability={product.availability}
  />
                  
                  </td>
                  <td>
                  <RemoveProductButton productId={product.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddProductForm />
    </div>
  );
}
