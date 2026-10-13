import client from "../../api/client";


export const deleteTodo = async (id: string) => {
    const response = await client.delete(`/todos/${id}`);
    return response.data;
}