import { useMutation } from "@tanstack/react-query";
import { updateTodo } from "../../services/todos/updateTodo.api";


export const useCompleteTodo = () => {
    return useMutation({
        mutationFn: async ({id, isCompleted}: {id: string, isCompleted: boolean}) => {
            const response = await updateTodo(id, isCompleted)
        }
    })
}