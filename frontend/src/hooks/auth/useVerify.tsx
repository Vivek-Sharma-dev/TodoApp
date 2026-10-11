import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ServerVerifyResponseType } from "../../types/auth/auth-response.type";
import type { AxiosError } from "axios";
import type { ServerErrorType } from "../../types/auth/auth-error.type";
import { verify } from "../../services/auth/register.api";
import { setAccessToken } from "../../auth/tokenStore";
import { getMe } from "../../services/auth/me.api";

export const useVerify = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ServerVerifyResponseType,
    AxiosError<ServerErrorType>,
    { otp: string }
  >({
    mutationFn: async (data: { otp: string }) => {
      const response = await verify(data);
      return response.data;
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
    onSuccess: async (data) => {
      setAccessToken(data.data.accessToken);
      try {
        const response = await getMe();
        const { user } = response.data;
        queryClient.setQueryData(["currentUser"], user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        throw error; // Rethrow the error to propagate it to the mutation's onError handler
      }
    },
  });
};
