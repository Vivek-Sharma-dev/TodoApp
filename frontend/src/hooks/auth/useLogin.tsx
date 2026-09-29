import { useMutation } from "@tanstack/react-query";
import type { ServerLoginResponseType } from "../../types/auth/auth-response.type";
import type { ServerErrorType } from "../../types/auth/auth-error.type";
import type { LoginInput } from "../../../../shared/schemas/auth.schema";
import { login } from "../../services/auth/login.api";
import type { AxiosError } from "axios";
import { setAccessToken } from "../../auth/tokenStore";

export const useLogin = () => {
  return useMutation<
    ServerLoginResponseType,  // response type
    AxiosError<ServerErrorType>,    // error type
    LoginInput    // input type
  >({
    mutationFn: async (data: LoginInput) => {
      const response = await login(data);
      return response.data;
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
    onSuccess: (data) => {
      if(data.data.accessToken) {
        setAccessToken(data.data.accessToken)
      }
      console.log("Login successful:", data);
    },
  });
};
