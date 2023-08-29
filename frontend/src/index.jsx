import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/fonts/Inter-Regular.ttf";
import "./assets/fonts/Inter-SemiBold.ttf";
import "./assets/fonts/Inter-Medium.ttf";
import "./index.css";
import axios from "axios";
import App from "./App";

axios.defaults.baseURL = "http://localhost:4040";
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
