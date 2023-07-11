import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./login-form.css";
import axios from "axios";
import { UserContext } from "../utils/user-context";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setLoggedInUsername, setId } = useContext(UserContext);

  async function logIn(ev) {
    ev.preventDefault();
    const { data } = await axios.post("/login", { username, password });
    setLoggedInUsername(username);
    setId(data.id);
  }

  return (
    <div className="form">
      <p className="header">Welcome to ChatConnect!</p>
      <p className="slogan">Log in to your ChatConnect Account.</p>
      <form>
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
          <p className="text">You don't have an account?</p>
          <Link
            to={`/signup`}
            style={{ textDecoration: "none", color: "#FFF" }}
          >
            <p className="btn">Sign up now</p>
          </Link>
        </div>
        <div className="btn2" onClick={logIn}>
          <Link to={`/chat`} style={{ textDecoration: "none", color: "#FFF" }}>
            <p className="text2">Log In</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
