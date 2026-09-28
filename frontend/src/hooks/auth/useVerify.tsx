import { useMutation } from "@tanstack/react-query";
import client from "../../api/client";
import type { ServerVerifyResponseType } from "../../types/auth/auth-response.type";
import type { AxiosError } from "axios";
import type { registerErrorType } from "../../types/auth/auth-error.type";

export const useVerify = () => {
    return useMutation<ServerVerifyResponseType, AxiosError<registerErrorType>, { otp: string }>({
        mutationFn: async (data: { otp: string }) => {
            const response = await client.post<ServerVerifyResponseType>('/auth/verify-email', data);
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