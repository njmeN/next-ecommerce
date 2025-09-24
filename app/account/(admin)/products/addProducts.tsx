'use client';

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver } from "react-hook-form";
import {
  AdminAddProductSchema,
  type AdminAddProductValues,
} from "@/lib/validation";
import { addProductAction } from "@/lib/actions/account";
import { useState } from "react";
import { toast } from "sonner";

import DualImageUploader from "@/components/forms/productUploader";

export default function AddProductForm() {
  const [images, setImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    trigger,
  } = useForm<AdminAddProductValues>({
    resolver: zodResolver(AdminAddProductSchema) as Resolver<AdminAddProductValues>,
    defaultValues: {
      images: [],
    },
  });

  const onSubmit: SubmitHandler<AdminAddProductValues> = async (data) => {
    try {
      await addProductAction(null, data);
      reset();
      setImages([]);
      toast.success("Product added successfully!");
    } catch (err: any) {
      console.error(err);
      if (err instanceof Error) {
      
        if (err.message.includes("SKU") || err.message.includes("Invalid input")) {
          toast.error(err.message);
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="tab__content active-tab">
      <div className="tab__body">
        <form onSubmit={handleSubmit(onSubmit)} className="form grid" style={{ marginTop: "3rem" }}>
          <h3 className="tab__header">Add New Product</h3>

          <input {...register("title")} placeholder="Title" className="form__input" />
          {errors.title && <p className="error">{errors.title.message}</p>}

          <input type="number" step="0.01" {...register("price")} placeholder="Price" className="form__input" />
          {errors.price && <p className="error">{errors.price.message}</p>}

          <input type="number" min={0} {...register("availability")} placeholder="Availability" className="form__input" />
          {errors.availability && <p className="error">{errors.availability.message}</p>}

          <input {...register("description")} placeholder="Description" className="form__input" />
          {errors.description && <p className="error">{errors.description.message}</p>}

          <input {...register("category")} placeholder="Category" className="form__input" />
          {errors.category && <p className="error">{errors.category.message}</p>}

          <input {...register("sku")} placeholder="SKU" className="form__input" />
          {errors.sku && <p className="error">{errors.sku.message}</p>}

          {/* Upload Images */}
          <div className="space-y-2">
            <DualImageUploader
              value={images}
              onChange={(urls) => {
                setImages(urls);
                setValue("images", urls);
                trigger("images");
              }}
            />
            {errors.images && <p className="error">{errors.images.message}</p>}
          </div>

          <button className="btn btn__md" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
