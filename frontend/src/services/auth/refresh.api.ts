import client from "../../api/client";

export const rotateToken = async () => {
  try {
    const response = await client.post("/auth/refresh");
    return response.data;
  } catch (error) {
    console.error(
      "Error during token rotation:",
      error.response?.data || error.message,
    );
  }
};
