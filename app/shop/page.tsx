import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { ChevronsRight, Eye, Heart, ShoppingCart } from "lucide-react";
import RatingStars from "@/components/products/RatingStars";
import AddToCartButton from "./addToCartButton";
import Loading from "@/components/common/loading";

const PRODUCTS_PER_PAGE = 8;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const skip = (page - 1) * PRODUCTS_PER_PAGE;
  const search = searchParams.search?.toLowerCase() || "";
  

  const whereClause: Prisma.ProductWhereInput = search
    ? {
        title: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      }
    : {};

  let products = [];
  let totalCount = 0;

  try {
    [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: PRODUCTS_PER_PAGE,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where: whereClause }),
    ]);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return <p className="container error">Failed to load products.</p>;
  }

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  return (
    <main className="main">
      {/* Breadcrumb */}
      <section className="breadcrumb">
        <ul className="breadcrumb__list flex container">
          <li>
            <Link href="/" className="breadcrumb__link">
              Home
            </Link>
          </li>
          <li>
            <span className="breadcrumb__link">{">"}</span>
          </li>
          <li>
            <span className="breadcrumb__link">Shop</span>
          </li>
        </ul>
      </section>

      {/* Optional: Show search term */}
      {search && (
        <p className="container" style={{ marginBottom: "1rem", marginTop: "2rem" }}>
          Showing results for: <strong>{search}</strong>
        </p>
      )}

      {/* Products */}
      <section className="products section container">
        <div className="products__container grid">
        {products.length === 0 ?<Loading/>:
          products.map((product) => (
            <div key={product.id} className="product__item">
              <div className="product__banner">
                <div className="product__images">
                  {product.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={product.title}
                      width={300}
                      height={300}
                      className={`product__img ${index === 0 ? "default" : "hover"}`}
                    />
                  ))}
                </div>
                <div className="product__actions">
                  <Link
                    href={`/shop/${product.id}`}
                    className="action__btn action__icon"
                    aria-label="Quick View"
                  >
                    <Eye size={16} strokeWidth={1} style={{ color: "hsl(154, 13%, 32%)" }} />
                  </Link>
                  <Link
                    href={`/wishlist`}
                    className="action__btn action__icon"
                    aria-label="Add to Wishlist"
                  >
                    <Heart size={16} strokeWidth={1} style={{ color: "hsl(154, 13%, 32%)" }} />
                  </Link>
                </div>
              </div>

              <div className="product__content">
                <span className="product__category">{product.category}</span>
                <Link href={`/shop/${product.id}`}>
                  <h3 className="product__title">{product.title}</h3>
                </Link>
                <div className="product__rating">
                  <RatingStars rating={product.rating} />
                </div>
                <div className="product__price flex">
                  <span className="new__price">${product.price}</span>
                </div>
                <AddToCartButton productId={product.id} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <ul className="pagination container flex">
          {[...Array(totalPages)].map((_, index) => (
            <li key={index}>
              <Link
                href={`/shop?page=${index + 1}${search ? `&search=${search}` : ""}`}
                className={`pagination__link ${page === index + 1 ? "active" : ""}`}
              >
                {index + 1}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={`/shop?page=${page + 1}${search ? `&search=${search}` : ""}`}
              className={`pagination__link icon action__icon ${page === totalPages ? "disabled" : ""}`}
              aria-disabled={page === totalPages}
            >
              <ChevronsRight />
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
