export const USER_ROLES = ["customer", "vendor", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const CUSTOMER_ROLE: UserRole = "customer";
export const VENDOR_ROLE: UserRole = "vendor";
export const ADMIN_ROLE: UserRole = "admin";
