import { useMutation } from "@tanstack/react-query";
import type { ServerVerifyResponseType } from "../../types/auth/auth-response.type";
import type { AxiosError } from "axios";
import type { ServerErrorType } from "../../types/auth/auth-error.type";
import { verify } from "../../services/auth/register.api";

export const useVerify = () => {
    return useMutation<ServerVerifyResponseType, AxiosError<ServerErrorType>, { otp: string }>({
        mutationFn: async (data: { otp: string }) => {
            const response = await verify(data)
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