import type { RequestHandler } from "express";

import { clearAuthCookie, setAuthCookie } from "../utils/cookies.js";
import { AppError } from "../utils/app-error.js";
import { UserModel } from "../models/user.model.js";
import { loginUser, registerUser } from "../services/auth.service.js";

export const registerController: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const result = await registerUser(request.body);

    setAuthCookie(response, result.token);

    response.status(201).json({
      success: true,
      data: {
        user: result.user
      },
      message: "Registration successful."
    });
  } catch (error) {
    next(error);
  }
};

export const loginController: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    const result = await loginUser(request.body);

    setAuthCookie(response, result.token);

    response.status(200).json({
      success: true,
      data: {
        user: result.user
      },
      message: "Login successful."
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController: RequestHandler = (_request, response) => {
  clearAuthCookie(response);

  response.status(200).json({
    success: true,
    data: null,
    message: "Logout successful."
  });
};

export const meController: RequestHandler = async (
  request,
  response,
  next
) => {
  try {
    if (!request.user) {
      next(
        new AppError(401, "AUTHENTICATION_REQUIRED", "Authentication is required.")
      );
      return;
    }

    const user = await UserModel.findById(request.user.id).lean();

    if (!user) {
      next(new AppError(404, "USER_NOT_FOUND", "User account was not found."));
      return;
    }

    response.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
