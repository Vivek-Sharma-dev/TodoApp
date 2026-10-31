import client from "../../api/client";

export type UpdateMetype = {
    name: string;
}

export const updateMe = async (data: UpdateMetype) => {
    const response = await client.patch(`/auth/me`, data);
    return response.data
}