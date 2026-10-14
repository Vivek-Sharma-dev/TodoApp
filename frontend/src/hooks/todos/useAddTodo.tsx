import { useMutation } from "@tanstack/react-query";
import { addTodo } from "../../services/todos/addTodo.api";
import { type AddTodoType } from "../../../../shared/schemas/todos.schema";
import { type AddTodoServerResponse } from "../../types/todos/todo.type";
import { AxiosError } from "axios";
import { type ServerErrorType } from "../../types/auth/auth-error.type";

export const useAddTodo = () => {
  return useMutation<
    AddTodoServerResponse,
    AxiosError<ServerErrorType>,
    AddTodoType
  >({
    mutationFn: async (data: AddTodoType) => {
      const response = await addTodo(data);
      return response;
    },
    onError: (err) => {
      console.log("error occur during adding Todo", err.message);
    },
    onSuccess: (data) => {
      console.log("Todo added Successfully", data.data);
    },
  });
};
