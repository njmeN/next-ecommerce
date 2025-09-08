"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, ReviewData } from "@/lib/validation";
import { addReview } from "@/lib/actions/reviews";          
import { toast } from "sonner";
import { useState } from "react";
import { Star } from "lucide-react";

type Props = {
  productId: string;
};

export function ReviewForm({ productId }: Props) {
  const [rating, setRating] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<ReviewData>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewData) => {
    if (rating === 0) {
      toast.error("Please select a rating.");
      setError("rating", { message: "Rating is required" });
      return;
    }

    const result = await addReview(productId, { ...data, rating });

    if (result.ok) {
      toast.success(result.message);
      reset();      
      setRating(0);  
    } else {
      toast.error(result.message);
    }
  };

  return (
    <>
      {/* RATING STARS */}
      <div className="rate__product mb-4 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            onClick={() => {
              setRating(i + 1);
              setValue("rating", i + 1);
              trigger("rating");
            }}
            size={24}
            strokeWidth={1.5}
            className="cursor-pointer transition"
            color={rating > i ? "#facc15" : "#d1d5db"}
            fill={rating > i ? "#facc15" : "none"}
          />
        ))}
      </div>
      {errors.rating && (
        <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
      )}

      {/* REVIEW FORM */}
      <form className="form grid" onSubmit={handleSubmit(onSubmit)}>
        {/* Comment */}
        <textarea
          className="form__input textarea"
          placeholder="Write comment"
          {...register("comment")}
        ></textarea>
        {errors.comment && (
          <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
        )}

        {/* Name + Email */}
        <div className="form__group grid">
          <input
            type="text"
            className="form__input"
            placeholder="Name"
            {...register("user")}
          />
          {errors.user && (
            <p className="text-red-500 text-sm mt-1">{errors.user.message}</p>
          )}

          <input
            type="email"
            className="form__input"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="form__btn">
          <button className="btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </>
  );
}
