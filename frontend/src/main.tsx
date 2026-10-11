import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import Desktop from "./pages/Desktop.tsx";
import AuthLayout from "./pages/auth/AuthLayout.tsx";
import Home from "./pages/Home.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Verify from "./pages/auth/Verify.tsx";
import { AuthProvider } from "./auth/AuthProvider.tsx";
import ProtectedRoutes from "./components/common/ProtectedRoutes.tsx";

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          {
            path: "register",
            Component: Register,
          },
          {
            path: "login",
            Component: Login,
          },
          {
            path: "verify",
            Component: Verify,
          },
        ],
      },

      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: "desktop",
            Component: Desktop,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </QueryClientProvider>,
);
