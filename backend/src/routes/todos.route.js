import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createTodoSchema,
  updateTodoSchema,
} from "../../../shared/schemas/todos.schema.js";
import * as todoController from "../controllers/todos.controller.js";

const todoRouter = Router();

todoRouter.post(
  "/",
  validate(createTodoSchema),
  todoController.createTodo,
);
todoRouter.get("/:id", todoController.getTodo);

export default todoRouter;
