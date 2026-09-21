import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import * as todoSchemas from "../../../shared/schemas/todos.schema.js";
import * as todoController from "../controllers/todos.controller.js";

const todoRouter = Router();

todoRouter.post(
  "/",
  validate(todoSchemas.createTodoSchema, "body"),
  todoController.createTodo,
);
todoRouter.get("/", todoController.getAllTodos);
todoRouter.get(
  "/:id",
  validate(todoSchemas.getTodoSchema, "params"),
  todoController.getTodo,
);
todoRouter.patch(
  "/:id",
  validate(todoSchemas.updateTodoSchema, "body"),
  validate(todoSchemas.getTodoSchema, "params"),
  todoController.updateTodo,
);

todoRouter.delete(
  "/:id",
  validate(todoSchemas.getTodoSchema, "params"),
  todoController.deleteTodo,
);

export default todoRouter;
