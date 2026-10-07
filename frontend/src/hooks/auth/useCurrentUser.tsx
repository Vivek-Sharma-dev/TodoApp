import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../services/auth/me.api";
import type { ServerCurrentUserResponseType } from "../../types/auth/auth-response.type";

export const useCurrentUser = () => {
  return useQuery<ServerCurrentUserResponseType>({
    queryKey: ["currentUser"],
    queryFn: getMe,
  });
};
