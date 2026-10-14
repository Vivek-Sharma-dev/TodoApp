import { useQuery } from "@tanstack/react-query";
import { getAllTodos } from "../../services/todos/getAllTodos";
import {type TodoType } from "../../types/todos/todo.type";


export const useAllTodos = () => {
    return useQuery<TodoType>({
        queryKey: ["todos"],
        queryFn: getAllTodos,
    })
}