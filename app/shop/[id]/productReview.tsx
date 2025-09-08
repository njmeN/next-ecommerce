"use client";

import { Star } from "lucide-react";
import { ReviewForm } from "./reviewForm";

type Props = {
  productId: string;
  reviews: {
    user: string;
    email: string;
    comment: string;
    rating: number;
    createdAt: string;
  }[];
};


export default function ProductReviews({ productId, reviews }: Props) {
  return (
    <div className="details__tab container">
      <div className="detail__tabs">
        <span className="detail__tab" data-target="#reviews">
          Review({reviews.length})
        </span>
      </div>

      <div className="details__tabs-content">
        <div className="details__tab-content">
          <div className="reviews__container grid">
            {reviews.map((review, index) => (
              <div key={index} className="review__single">
                <div>
                  <h4 className="review__title">{review.user}</h4>
                </div>
                <div className="review__data">
                  <div className="review__rating">
                  {[...Array(5)].map((_, i) => (
    <Star
      key={i}
      size={20}
      strokeWidth={1.5}
      color={i < review.rating ? "#facc15" : "#d1d5db"}
      fill={i < review.rating ? "#facc15" : "none"}
    />
  ))}
                  </div>
                  <p className="review__description">{review.comment}</p>
                  <span className="review__date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="review__form">
            <h4 className="review__form-title">Add a review</h4>
            <ReviewForm productId={productId} />
          </div>
        </div>
      </div>
    </div>
  );
}
