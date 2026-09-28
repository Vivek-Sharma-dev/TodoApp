import { useMutation } from "@tanstack/react-query";
import type { RegisterInput } from "../../../../shared/schemas/auth.schema";
import type { ServerErrorType } from "../../types/auth/auth-error.type";
import type {  AxiosError } from "axios";
import type { ServerRegisterResponseType } from "../../types/auth/auth-response.type";
import { register } from "../../services/auth/register.api";

export const useRegister = () => {
    return useMutation<ServerRegisterResponseType, AxiosError<ServerErrorType>, RegisterInput>({
        mutationFn: async (data: RegisterInput) => {
            const response = await register(data)
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