import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./assets/fonts/Inter-Medium.ttf";
import "./assets/fonts/Inter-Regular.ttf";
import "./assets/fonts/Inter-SemiBold.ttf";
import "./index.css";
import LoginPage from "./pages/login-page/login-page";
import ErrorPage from "./components/utils/route-error";
import SignupPage from "./pages/signup-page/signup-page";
import ChatPage from "./pages/chat-page/chat-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
