import client from "../../api/client";

export type TodoUpdateType = {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
  due_date?: string | null;
};

export const updateTodo = async (
  id: string,
  updatedTodo: TodoUpdateType,
) => {
  const response = await client.patch(`/todos/${id}`, updatedTodo);
  return response.data;
};