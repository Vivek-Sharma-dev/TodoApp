import { useMutation } from "@tanstack/react-query";
import { deleteTodo } from "../../services/todos/deleteTodo.api";

export const useDeleteTodo = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteTodo(id);
      return response;
    },
    onError: (err) => {
      console.log("Error got occur during deleting todo", err.message);
    },
    onSuccess: (data) => {
      console.log("Todo deleted successfully: ", data.data);
    },
  });
};
