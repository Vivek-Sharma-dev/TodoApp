
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { addTodo } from "../../services/todos/addTodo.api";
import type { AddTodoType } from "../../../../shared/schemas/todos.schema";
import type { AddTodoServerResponse } from "../../types/todos/todo.type";
import type { ServerErrorType } from "../../types/auth/auth-error.type";

export const useAddTodo = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AddTodoServerResponse,
    AxiosError<ServerErrorType>,
    AddTodoType
  >({
    mutationFn: addTodo,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });
};
