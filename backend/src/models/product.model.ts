import { Schema, model, type HydratedDocument, type Model, type Types } from "mongoose";

export interface Product {
  vendorId: Types.ObjectId;
  name: string;
  description: string;
  price: number; // Stored in minor units (e.g., cents)
  imageUrl?: string;
  category: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductDocument = HydratedDocument<Product>;

const productSchema = new Schema<Product>(
  {
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    imageUrl: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Index for search functionality
productSchema.index({ name: "text", description: "text" });

export const ProductModel: Model<Product> = model<Product>("Product", productSchema);
