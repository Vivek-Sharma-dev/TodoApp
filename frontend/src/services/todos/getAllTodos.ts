
import client from "../../api/client";
import { type TodoType } from "../../types/todos/todo.type";

export type GetAllTodosResponse = {
  success: boolean;
  data: TodoType[];
  meta: {
    totalTodos: number;
  };
  message: string;
};

export const getAllTodos = async (
  status?: string
): Promise<GetAllTodosResponse> => {
  const response = await client.get<GetAllTodosResponse>("/todos", {
    params: { status },
  });

  return response.data;
};
