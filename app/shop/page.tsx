import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { ChevronsRight, Eye } from "lucide-react";
import RatingStars from "@/components/products/RatingStars";
import AddToCartButton from "./addToCartButton";
import Loading from "@/components/common/loading";
import WishlistToggleButton from "./wishlistToggleButton";
import { type Product } from "@prisma/client";

const PRODUCTS_PER_PAGE = 8;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;  
}) {
  const resolvedParams = await searchParams;  

  const page = parseInt(resolvedParams?.page ?? "1", 10); 
  const skip = (page - 1) * PRODUCTS_PER_PAGE;
  const search = resolvedParams?.search?.toLowerCase() ?? "";  
  const category = resolvedParams?.category ?? ""; 

  const whereClause: Prisma.ProductWhereInput = {
    AND: [
      search
        ? {
            title: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {},
      category
        ? {
            category: {
              equals: category,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {},
    ],
  };

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
      <section className="breadcrumb">
        <ul className="breadcrumb__list flex container">
          <li>
            <Link href="/" className="breadcrumb__link">Home</Link>
          </li>
          <li><span className="breadcrumb__link">{">"}</span></li>
          <li><span className="breadcrumb__link">Shop</span></li>
        </ul>
      </section>

      {(search || category) && (
        <p className="container" style={{ margin: "2rem 0 1rem" }}>
          Showing results for:
          {search && <strong> "{search}"</strong>}
          {category && <strong> Category: {category}</strong>}
        </p>
      )}

      <section className="products section container">
        <div className="products__container grid">
          {products.length === 0 ? (
            <Loading />
          ) : (
            products.map((product: Product) => (
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
                      <Eye size={16} strokeWidth={1} />
                    </Link>
                    <WishlistToggleButton
                      product={{
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        images: product.images,
                      }}
                    />
                  </div>
                </div>

                <div className="product__content">
                  <span className="product__category">{product.category}</span>
                  <Link href={`/shop/${product.id}`}>
                    <h3 className="product__title">{product.title}    {product.availability === 0 && (
 <span className="error"> (Out of stock)</span>
)}</h3>
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
            ))
          )}
        </div>

        {/* Pagination */}
        <ul className="pagination container flex">
          {[...Array(totalPages)].map((_, index) => {
            const href = `/shop?page=${index + 1}${
              search ? `&search=${search}` : ""
            }${category ? `&category=${category}` : ""}`;
            return (
              <li key={index}>
                <Link
                  href={href}
                  className={`pagination__link ${page === index + 1 ? "active" : ""}`}
                >
                  {index + 1}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href={`/shop?page=${page + 1}${
                search ? `&search=${search}` : ""
              }${category ? `&category=${category}` : ""}`}
              className={`pagination__link icon action__icon ${
                page === totalPages ? "disabled" : ""
              }`}
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