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
<<<<<<< HEAD
import ChatPage from "./pages/chat-page/chat-page";
=======
import axios from "axios";

<<<<<<< HEAD
axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;
>>>>>>> bcc5a6a (updating structure and adding api files)
=======
axios.defaults.baseURL = "http://localhost:4040/";
axios.defaults.withCredentials = false;
>>>>>>> dfbd316 (adding UserContext)

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
    errorElement: <ErrorPage />,
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
