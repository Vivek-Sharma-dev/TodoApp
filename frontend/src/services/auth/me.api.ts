import client from "../../api/client";

export const getMe = () => client.get("/auth/me");