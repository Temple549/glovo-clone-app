import { Schema, model, type HydratedDocument, type Model } from "mongoose";

import type { UserRole } from "../constants/roles.js";

export interface User {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string;
  status: "active" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

export type UserDocument = HydratedDocument<User>;

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
      required: true,
      index: true
    },
    avatarUrl: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const UserModel: Model<User> = model<User>("User", userSchema);
