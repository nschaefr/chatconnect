import React from "react";
import "./login-form.css";

function LoginForm() {
  return (
    <div className="form">
      <p className="header">Welcome to ChatConnect!</p>
      <p className="slogan">Log in to your ChatConnect Account.</p>
      <form>
        <input type="name" className="input2" placeholder="Username" />
        <br />
        <input type="password" className="pwd" placeholder="Password" />
      </form>
      <div className="decision">
        <div>
          <p className="text">You don't have an account?</p>
          <p className="btn">Sign up now</p>
        </div>
        <div className="btn2">
          <p className="text2">Log In</p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
