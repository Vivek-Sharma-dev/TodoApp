import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "../../services/todos/deleteTodo.api";

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteTodo(id);
      return response;
    },
    onError: (err) => {
      console.log("Error occur during deletion: ", err)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["todos"]})
    },
  });
};
