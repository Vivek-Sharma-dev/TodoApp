import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import * as authSchema from "../../../shared/schemas/auth.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validate(authSchema.registerSchema, "body"),
  asyncHandler(authController.register),
);

authRouter.post(
  "/login",
  validate(authSchema.loginSchema, "body"),
  asyncHandler(authController.login),
);

authRouter.post("/logout", authMiddleware, asyncHandler(authController.logout));

authRouter.post(
  "/refresh",
  authMiddleware,
  asyncHandler(authController.refresh),
);
authRouter.post(
  "/logout-all",
  authMiddleware,
  asyncHandler(authController.logoutAll),
);
authRouter.post("/me", authMiddleware, asyncHandler(authController.getMe));
export default authRouter;
