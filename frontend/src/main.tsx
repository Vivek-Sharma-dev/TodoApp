import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/auth/Login.tsx";
import Register from "./pages/auth/Register.tsx";
import Desktop from "./pages/auth/Desktop.tsx";
import AuthLayout from "./pages/auth/AuthLayout.tsx";
import Home from "./pages/auth/Home.tsx";

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
            path: "desktop",
            Component: Desktop,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
