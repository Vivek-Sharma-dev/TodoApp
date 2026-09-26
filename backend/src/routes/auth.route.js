import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import * as authSchema from "../../../shared/schemas/auth.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import authRateLimiter from "../middlewares/rateLimit.middleware.js";

const authRouter = Router();

authRouter.post(
  "/register",
  authRateLimiter,
  validate(authSchema.registerSchema, "body"),
  asyncHandler(authController.register),
);

authRouter.post(
  "/email-verification",
  asyncHandler(authController.emailVerification),
);

authRouter.post(
  "/login",
  authRateLimiter,
  validate(authSchema.loginSchema, "body"),
  asyncHandler(authController.login),
);

authRouter.post("/logout", authMiddleware, asyncHandler(authController.logout));

authRouter.post(
  "/refresh",
  authRateLimiter,
  asyncHandler(authController.refresh),
);
authRouter.post(
  "/logout-all",
  authMiddleware,
  asyncHandler(authController.logoutAll),
);
authRouter.get("/me", authMiddleware, asyncHandler(authController.getMe));
export default authRouter;
