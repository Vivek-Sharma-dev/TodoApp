import { createContext, useEffect, useState } from "react";
import { authBootstrap } from "./authBootstrap";
import { type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  isInitializing: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const queryClient = useQueryClient();
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const user = await authBootstrap();

        if(user && isMounted) {
          queryClient.setQueryData(["currentUser"], user);
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    void initializeAuth();
    return () => {
      isMounted = false;
    };
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};


