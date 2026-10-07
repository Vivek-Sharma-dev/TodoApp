import client from "../../api/client";

export const getMe = async () => {
    const response = await client.get("/auth/me");
    return response.data
};