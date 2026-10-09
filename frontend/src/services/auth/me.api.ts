import client from "../../api/client";

export const getMe = async () => {
    try {
            const response = await client.get("/auth/me");
    return response.data
    } catch (error) {
        console.error("Error during getMe:", error);
    }
};