import type { UserRole } from "../constants/roles.js";

export interface AuthTokenPayload {
  sub: string;
  role: UserRole;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "suspended";
}
