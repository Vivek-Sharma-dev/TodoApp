import client from "../../api/client";
import { type AddTodoType } from "../../../../shared/schemas/todos.schema.ts";

export const addTodo = async (data: AddTodoType) => {
  const response = await client.post("/todos", data);
  return response.data;
};
