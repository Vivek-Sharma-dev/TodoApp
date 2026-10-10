import { createContext, useContext, useEffect, useState } from "react";
import { authBootstrap } from "./authBootstrap";
import { type ReactNode } from "react";

type AuthContextType = {
  isInitializing: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMuted = true;

    const initializeAuth = async () => {
      try {
        await authBootstrap();
      } finally {
        if (isMuted) {
          setIsInitializing(false);
        }
      }
    };

    void initializeAuth();
    return () => {
      isMuted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if(!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context;
}