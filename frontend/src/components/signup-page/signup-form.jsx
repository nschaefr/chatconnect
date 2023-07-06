import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./signup-form.css";
import axios from "axios";
import { UserContext } from "../utils/user-context";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setLoggedInUsername, setId } = useContext(UserContext);

  async function signUp(ev) {
    ev.preventDefault();
    const { data } = await axios.post("/signup", { email, username, password });
    setLoggedInUsername(username);
    setId(data.id);
  }

  return (
    <div className="form">
      <p className="header">Welcome to ChatConnect!</p>
      <p className="slogan">Sign up for chatting with your friends.</p>
      <form>
        <input
          type="email"
          onChange={(ev) => setEmail(ev.target.value)}
          className="input"
          placeholder="example@mail.com"
          size="45"
        />
        <br />
        <input
          type="name"
          onChange={(ev) => setUsername(ev.target.value)}
          className="input2"
          placeholder="Username"
        />
        <br />
        <input
          type="password"
          onChange={(ev) => setPassword(ev.target.value)}
          className="pwd"
          placeholder="Password"
        />
      </form>
      <div className="decision">
        <div>
          <p className="text">Already have an account?</p>
          <Link to={`/`} style={{ textDecoration: "none", color: "#FFF" }}>
            <p className="btn">Login now</p>
          </Link>
        </div>
        <div className="btn2" onClick={signUp}>
          <Link to={`/chat`} style={{ textDecoration: "none", color: "#FFF" }}>
            <p className="text2">Sign Up</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
