import client from "../../api/client";


export const getTodo = async (id: string) => {
    const response = await client.get(`/todos/${id}`);
    return response.data;
}