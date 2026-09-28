import { useMutation } from "@tanstack/react-query";
import type { RegisterInput } from "../../../../shared/schemas/auth.schema";
import client from "../../api/client";
import type { registerErrorType } from "../../types/auth/auth-error.type";
import type {  AxiosError } from "axios";
import type { ServerRegisterResponseType } from "../../types/auth/auth-response.type";

export const useRegister = () => {
    return useMutation<ServerRegisterResponseType, AxiosError<registerErrorType>, RegisterInput>({
        mutationFn: async (data: RegisterInput) => {
            const response = await client.post<ServerRegisterResponseType>('/auth/register', data);
            return response.data;
        },
        onError: (error) => {
            console.error("Registration error:", error);
        },

        onSuccess: (data) => {
            console.log("Registration successful:", data);
        }
    })
}