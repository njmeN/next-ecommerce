export const dynamic = 'force-dynamic';
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RatingStars from "@/components/products/RatingStars";
import ProductGallery from "@/components/products/productGallery";
import ProductCartControls from "./cartControl";
import { CreditCard, Crown, RefreshCcw } from "lucide-react";
import ProductReviews from "./productReview";
import WishlistToggleButton from "../wishlistToggleButton";

type ProductPageProps = {
  params: Promise<{ id: string }>;  
};

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { id } = await params;  

  let product;

  try {
    product = await prisma.product.findUnique({
      where: { id },  
      include: { reviews: true },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return (
      <div className="container section">
        <h1 className="error">Something went wrong while loading the product.</h1>
      </div>
    );
  }

  if (!product) {
    return notFound(); 
  }

  const formattedReviews = product.reviews.map((r) => ({
    user: r.user,
    email: r.email,
    comment: r.comment,
    rating: r.rating,
    createdAt: r.createdAt.toISOString(), 
  }));

  return (
    <section>
      {/* Breadcrumb */}
      <section className="breadcrumb">
        <ul className="breadcrumb__list flex container">
          <li><a href="/" className="breadcrumb__link">Home</a></li>
          <li><span className="breadcrumb__link">{`>`}</span></li>
          <li><a href="/shop" className="breadcrumb__link">Shop</a></li>
          <li><span className="breadcrumb__link">{`>`}</span></li>
          <li><span className="breadcrumb__link">{product.title}</span></li>
        </ul>
      </section>

      {/* Product Details */}
      <section className="details section__lg">
        <div className="details__container container grid">
          <ProductGallery images={product.images} title={product.title} />

          {/* Product Info */}
          <div className="details__group">
            <h3 className="details__title">{product.title}</h3>

            <div className="details__price flex">
              <span className="new__price">${product.price}</span>
            </div>

            <p className="short__description">{product.description}</p>

            <ul className="product__list">
              <li className="list__item flex"><Crown size={20} strokeWidth={1} /> 1 year Warranty</li>
              <li className="list__item flex"><RefreshCcw size={20} strokeWidth={1} /> 30 Days Return Policy</li>
              <li className="list__item flex"><CreditCard size={20} strokeWidth={1} /> Cash on Delivery available</li>
            </ul>

            <div className="details__action">
              <ProductCartControls
                productId={product.id}
                max={product.availability}
              />
              <WishlistToggleButton
                product={{
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  images: product.images,
                }}
              />
            </div>

            <ul className="details__meta">
              <li className="meta__list flex"><span>SKU:</span> {product.sku}</li>
              <li className="meta__list flex"><span>Availability:</span> {product.availability} Items</li>
            </ul>

            {product.availability === 0 && (
              <p className="error">Out of stock</p>
            )}

            <div className="product__rating">
              <RatingStars rating={product.rating ?? 0} />
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="details__reviews container section__lg">
          <ProductReviews
            productId={product.id}
            reviews={formattedReviews}
          />
        </section>
      </section>
    </section>
  );
}