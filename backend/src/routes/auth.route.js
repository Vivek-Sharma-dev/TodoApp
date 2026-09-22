import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import * as authSchema from "../../../shared/schemas/auth.schema.js";

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

export default authRouter;
