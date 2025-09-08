import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface RatingStarsProps {
  rating?: number;
  size?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating = 0, size = 16 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.85;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="product__rating">
      {Array.from({ length: fullStars }).map((_, i) => (
        <FaStar key={`full-${i}`} color="hsl(42, 100%, 50%)" size={size} />
      ))}

      {hasHalfStar && (
        <FaStarHalfAlt key="half" color="hsl(42, 100%, 50%)" size={size} />
      )}

      {Array.from({ length: emptyStars }).map((_, i) => (
        <FaRegStar key={`empty-${i}`} color="hsl(42, 100%, 50%)" size={size} />
      ))}
    </div>
  );
};

export default RatingStars;