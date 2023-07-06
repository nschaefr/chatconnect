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
<<<<<<< HEAD
import ChatPage from "./pages/chat-page/chat-page";
=======
import axios from "axios";
import { ContextProvider } from "./components/utils/user-context";

<<<<<<< HEAD
axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;
>>>>>>> bcc5a6a (updating structure and adding api files)
=======
axios.defaults.baseURL = "http://localhost:4040/";
axios.defaults.withCredentials = false;
>>>>>>> dfbd316 (adding UserContext)
=======
import axios from "axios";
import { ContextProvider } from "./components/utils/user-context";

axios.defaults.baseURL = "http://localhost:4040/";
axios.defaults.withCredentials = false;
>>>>>>> 69e57f078d0decf221a62d8b14aaff6b8678f781

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
<<<<<<< HEAD
<<<<<<< HEAD
    path: "/chat",
    element: <ChatPage />,
=======
    path: "/chatpage",
    element: <ChatPage />,
    errorElement: <ErrorPage />,
>>>>>>> 69e57f0 (update index.js)
=======
    path: "/chatpage",
    element: <ChatPage />,
    errorElement: <ErrorPage />,
>>>>>>> 69e57f078d0decf221a62d8b14aaff6b8678f781
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </React.StrictMode>
);
