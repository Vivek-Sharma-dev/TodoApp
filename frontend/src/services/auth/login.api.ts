import type { LoginInput } from "../../../../shared/schemas/auth.schema";
import client from "../../api/client";

export const login = async (data: LoginInput) => {
    try {

        const response = await client.post("/auth/login", data);
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
    }
};
