import React from "react";
import { Link } from "react-router-dom";
import "./signup-form.css";

function SignupForm() {
  return (
    <div className="form">
      <p className="header">Welcome to ChatConnect!</p>
      <p className="slogan">Sign up for chatting with your friends.</p>
      <form>
        <input
          type="email"
          className="input"
          placeholder="example@mail.com"
          size="45"
        />
        <br />
        <input type="name" className="input2" placeholder="Username" />
        <br />
        <input type="password" className="pwd" placeholder="Password" />
      </form>
      <div className="decision">
        <div>
          <p className="text">Already have an account?</p>
          <Link to={`/`}>
            <p className="btn">Login now</p>
          </Link>
        </div>
        <div className="btn2">
          <p className="text2">Sign Up</p>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
