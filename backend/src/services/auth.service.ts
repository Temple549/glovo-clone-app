import type { LoginInput, RegisterInput } from "../validators/auth.validators.js";
import { UserModel, type UserDocument } from "../models/user.model.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { signAuthToken } from "../utils/token.js";
import { AppError } from "../utils/app-error.js";
import type { AuthenticatedUser } from "../types/auth.types.js";

function toAuthenticatedUser(user: UserDocument): AuthenticatedUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  };
}

export async function registerUser(
  input: RegisterInput
): Promise<{ user: AuthenticatedUser; token: string }> {
  const existingUser = await UserModel.findOne({ email: input.email });

  if (existingUser) {
    throw new AppError(
      409,
      "EMAIL_ALREADY_EXISTS",
      "An account with this email already exists."
    );
  }

  const passwordHash = await hashPassword(input.password);

  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    passwordHash,
    role: "customer",
    status: "active"
  });

  const authenticatedUser = toAuthenticatedUser(user);
  const token = signAuthToken({
    sub: authenticatedUser.id,
    role: authenticatedUser.role
  });

  return {
    user: authenticatedUser,
    token
  };
}

export async function loginUser(
  input: LoginInput
): Promise<{ user: AuthenticatedUser; token: string }> {
  const user = await UserModel.findOne({ email: input.email }).select(
    "+passwordHash"
  );

  if (!user || !(await verifyPassword(user.passwordHash, input.password))) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Email or password is incorrect."
    );
  }

  if (user.status !== "active") {
    throw new AppError(403, "ACCOUNT_SUSPENDED", "This account is not active.");
  }

  const authenticatedUser = toAuthenticatedUser(user);
  const token = signAuthToken({
    sub: authenticatedUser.id,
    role: authenticatedUser.role
  });

  return {
    user: authenticatedUser,
    token
  };
}
