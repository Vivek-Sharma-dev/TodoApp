import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../services/auth/me.api";
import type { UserType } from "../../types/auth/auth-response.type";

export const useCurrentUser = () => {
  return useQuery<UserType>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await getMe();
      return response.data.user
    },
    enabled: false, // Disable automatic fetching on mount
  });
};
