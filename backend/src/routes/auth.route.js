import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import * as authSchema from "../../../shared/schemas/auth.schema.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validate(authSchema.registerSchema, "body"),
  authController.register,
);

authRouter.post(
  "/login",
  validate(authSchema.loginSchema, "body"),
  authController.login,
);

authRouter.post('/logout', authController.logout)

authRouter.post('/refresh', authController.refresh)
authRouter.post('/logout-all',authMiddleware, authController.logoutAll)
authRouter.post('/me', authMiddleware, authController.getMe)
export default authRouter;
