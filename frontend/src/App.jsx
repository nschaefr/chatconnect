import "./App.css";
import React from "react";
import SignupPage from "./pages/signup-page/signup-page";
import LoginPage from "./pages/login-page/login-page";

function App() {
  return (
    <div className="app">
    	{/** <SignupPage /> */}
		<LoginPage />
    </div>
  );
}

export default App;
