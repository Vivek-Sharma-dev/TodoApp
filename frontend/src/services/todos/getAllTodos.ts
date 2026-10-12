import client from "../../api/client";

export const getAllTodos = async () => {
  const response = await client.get("/todos");
  return response.data;
};
