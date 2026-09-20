import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createTodoSchema,
  updateTodoSchema,
} from "../../../shared/schemas/todos.schema.js";
import * as todoController from "../controllers/todos.controller.js";

const todoRouter = Router();

todoRouter.post(
  "/todos",
  validate(createTodoSchema),
  todoController.createTodo,
);

export default todoRouter;
