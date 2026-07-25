import "dotenv/config";

import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { env } from "../config/env.js";
import { UserModel } from "../models/user.model.js";
import { VendorModel } from "../models/vendor.model.js";
import { hashPassword } from "../utils/password.js";

interface SeedAccount {
  name: string;
  email: string;
  role: "customer" | "vendor" | "admin";
  password: string;
}

async function upsertUser(account: SeedAccount) {
  const passwordHash = await hashPassword(account.password);

  return UserModel.findOneAndUpdate(
    { email: account.email.toLowerCase() },
    {
      $set: {
        name: account.name,
        email: account.email.toLowerCase(),
        passwordHash,
        role: account.role,
        status: "active"
      }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );
}

async function seed(): Promise<void> {
  const customerPassword = env.SEED_CUSTOMER_PASSWORD;
  const vendorPassword = env.SEED_VENDOR_PASSWORD;
  const adminPassword = env.SEED_ADMIN_PASSWORD;

  if (!customerPassword || !vendorPassword || !adminPassword) {
    throw new Error(
      "SEED_CUSTOMER_PASSWORD, SEED_VENDOR_PASSWORD, and SEED_ADMIN_PASSWORD are required."
    );
  }

  await connectDatabase();

  const customer = await upsertUser({
    name: "Test Customer",
    email: "customer@test.local",
    role: "customer",
    password: customerPassword
  });

  const vendorOwner = await upsertUser({
    name: "Test Vendor Owner",
    email: "vendor@test.local",
    role: "vendor",
    password: vendorPassword
  });

  await upsertUser({
    name: "Test Administrator",
    email: "admin@test.local",
    role: "admin",
    password: adminPassword
  });

 await VendorModel.findOneAndUpdate(
  { ownerId: vendorOwner._id },
  {
    $set: {
      businessName: "Test Kitchen",
      description: "Development vendor for local testing.",
      address: "Development Address",
      cuisine: "Mixed",
      isOpen: true,
      approvalStatus: "approved"
    },
    $setOnInsert: {
      ownerId: vendorOwner._id
    }
  },
  {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  }
)
};
