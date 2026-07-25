import { Schema, model, type HydratedDocument, type Model, type Types } from "mongoose";

export interface Favorite {
  userId: Types.ObjectId;
  vendorId?: Types.ObjectId;
  productId?: Types.ObjectId;
  createdAt: Date;
}

export type FavoriteDocument = HydratedDocument<Favorite>;

const favoriteSchema = new Schema<Favorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", index: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", index: true }
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

// Ensure a user can't favorite the same item twice
favoriteSchema.index({ userId: 1, vendorId: 1 }, { unique: true, sparse: true });
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true, sparse: true });

export const FavoriteModel: Model<Favorite> = model<Favorite>("Favorite", favoriteSchema);
