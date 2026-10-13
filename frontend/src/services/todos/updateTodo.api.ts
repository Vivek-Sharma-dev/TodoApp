import client from "../../api/client";

type Todo = {
  title: string;
  description: string;
  completed: boolean;
};


export const updateTodo = async (id: string, updatedTodo: Todo) => {
  const response = await client.put(`/todos/${id}`, updatedTodo);
  return response.data;
}