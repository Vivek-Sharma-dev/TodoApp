import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTodo,
  type TodoUpdateType,
} from "../../services/todos/updateTodo.api";

type UpdateTodoVariables = {
  id: string;
  data: TodoUpdateType;
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateTodoVariables) =>
      updateTodo(id, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },

    onError: (error) => {
      console.error("Error occurred while updating todo:", error);
    },
  });
};