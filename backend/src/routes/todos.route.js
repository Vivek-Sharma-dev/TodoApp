import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import * as todoSchemas from "../../../shared/schemas/todos.schema.js";
import * as todoController from "../controllers/todos.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const todoRouter = Router();

todoRouter.post(
  "/",
  authMiddleware,
  validate(todoSchemas.createTodoSchema, "body"),
  todoController.createTodo,
);
todoRouter.get("/", authMiddleware, todoController.getAllTodos);
todoRouter.get(
  "/:id",
  authMiddleware,
  validate(todoSchemas.getTodoSchema, "params"),
  todoController.getTodo,
);
todoRouter.patch(
  "/:id",
  authMiddleware,
  validate(todoSchemas.updateTodoSchema, "body"),
  validate(todoSchemas.getTodoSchema, "params"),
  todoController.updateTodo,
);

todoRouter.delete(
  "/:id",
  authMiddleware,
  validate(todoSchemas.getTodoSchema, "params"),
  todoController.deleteTodo,
);

export default todoRouter;
