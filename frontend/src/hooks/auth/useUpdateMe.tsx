import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateMe,
  type UpdateMetype,
} from "../../services/auth/updateMe.api";
import type { UserType } from "../../types/auth/auth-response.type";

export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMetype) => updateMe(data),

    onSuccess: async (_response, variables) => {
      // Update the existing cached user immediately.
      queryClient.setQueryData<UserType>(
        ["currentUser"],
        (currentUser) => {
          if (!currentUser) return currentUser as undefined;

          return {
            ...currentUser,
            name: variables.name.trim(),
          };
        },
      );

      // Refresh other active queries that depend on this user.
      await queryClient.invalidateQueries({
        queryKey: ["currentUser"],
        refetchType: "active",
      });
    },

    onError: (error) => {
      console.error("Error updating user details:", error.message);
    },
  });
};