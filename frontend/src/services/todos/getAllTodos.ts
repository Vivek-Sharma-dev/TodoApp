
import client from "../../api/client";
import { type TodoType } from "../../types/todos/todo.type";



export const getAllTodos = async (
  status?: string
): Promise<TodoType[]> => {
  const response = await client.get<TodoType[]>("/todos", {
    params: { status },
  });

  return response.data;
};
