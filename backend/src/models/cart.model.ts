import { Schema, model, type HydratedDocument, type Model, type Types } from "mongoose";

export interface CartItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Cart {
  userId: Types.ObjectId;
  vendorId?: Types.ObjectId;
  items: CartItem[];
  updatedAt: Date;
}

export type CartDocument = HydratedDocument<Cart>;

const cartSchema = new Schema<Cart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", index: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        imageUrl: String
      }
    ]
  },
  { timestamps: true, versionKey: false }
);

export const CartModel: Model<Cart> = model<Cart>("Cart", cartSchema);
