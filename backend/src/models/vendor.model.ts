import {
  Schema,
  model,
  type HydratedDocument,
  type Model,
  type Types
} from "mongoose";

export interface Vendor {
  ownerId: Types.ObjectId;
  businessName: string;
  description: string;
  address: string;
  cuisine: string;
  isOpen: boolean;
  approvalStatus: "pending" | "approved" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

export type VendorDocument = HydratedDocument<Vendor>;

const vendorSchema = new Schema<Vendor>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300
    },
    cuisine: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    isOpen: {
      type: Boolean,
      default: true,
      required: true
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "suspended"],
      default: "pending",
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const VendorModel: Model<Vendor> = model<Vendor>(
  "Vendor",
  vendorSchema
);
