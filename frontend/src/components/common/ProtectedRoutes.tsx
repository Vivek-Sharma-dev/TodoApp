import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../../hooks/auth/useAuthContext";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser";

const ProtectedRoutes = () => {
  const { isInitializing } = useAuthContext();
  const { data: currentUser } = useCurrentUser();

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-text-secondary">
        Checking your session...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
