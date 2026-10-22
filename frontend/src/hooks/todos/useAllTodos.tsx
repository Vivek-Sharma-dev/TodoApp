import { useQuery } from "@tanstack/react-query";
import { getAllTodos, type GetAllTodosResponse } from "../../services/todos/getAllTodos";

export const useAllTodos = (status?: string | undefined) => {
  return useQuery<GetAllTodosResponse>({
    queryKey: ["todos", status],
    queryFn: () => getAllTodos(status),
  });
};
