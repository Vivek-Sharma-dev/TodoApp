import { useMutation } from "@tanstack/react-query";
import type { ServerLoginResponseType } from "../../types/auth/auth-response.type";
import type { ServerErrorType } from "../../types/auth/auth-error.type";
import type { LoginInput } from "../../../../shared/schemas/auth.schema";
import { login } from "../../services/auth/login.api";
import type { AxiosError } from "axios";

export const useLogin = () => {
  return useMutation<
    ServerLoginResponseType,
    AxiosError<ServerErrorType>,
    LoginInput
  >({
    mutationFn: async (data: LoginInput) => {
      const response = await login(data);
      return response.data;
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
    },
  });
};
