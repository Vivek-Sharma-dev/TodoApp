import client from "../../api/client";

export const rotateToken = async () => {
  const response = await client.post("/auth/refresh");

  return response.data;
};
