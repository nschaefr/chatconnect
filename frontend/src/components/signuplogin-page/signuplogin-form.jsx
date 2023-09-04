import React, { useContext, useState, useRef } from "react";
import { UserContext } from "../utils/user-context";
import "./styles.css";
import axios from "axios";
import Logo from "../../assets/icons/logo.svg";

function SignuploginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState("login");
  const { setLoggedInUsername, setId } = useContext(UserContext);
  const validPassword = "^(.){8,}$";
  const validUsername = "^(.){1,}$";
  const [isValidPassword, setPasswordValidation] = useState(null);
  const [isValidUsername, setUsernameValidation] = useState(null);
  const [isValidAccount, setAccountValidation] = useState(null);
  const [isDupeUsername, setDupeValidation] = useState(null);
  const usernameIn = useRef(null);
  const passwordIn = useRef(null);

  async function submitHandler() {
    const url = form === "signup" ? "signup" : "login";
    const { data } = await axios.post(url, { username, password });
    form === "signup"
      ? setDupeValidation(data.duplicate)
      : setAccountValidation(data.valid);
    if (
      form === "signup" &&
      isValidUsername &&
      isValidPassword &&
      data.duplicate !== true
    ) {
      setLoggedInUsername(username);
      setId(data.id);
    }
    if (form === "login" && data.valid) {
      setLoggedInUsername(username);
      setId(data.id);
    } else {
      setAccountValidation(false);
    }
  }

  const validatePassword = (password) => {
    if (password && password.match(validPassword)) {
      setPassword(password);
      setPasswordValidation(true);
    } else {
      setPasswordValidation(false);
    }
  };

  const validateUsername = (username) => {
    if (username && username.match(validUsername)) {
      setUsername(username);
      setUsernameValidation(true);
      setDupeValidation(null);
      setAccountValidation(null);
    } else {
      setUsernameValidation(false);
    }
  };

  return (
    <div className="form">
      <div className="headerDiv">
        <img src={Logo} width={"40px"} />
        <p className="header">chatconnect</p>
      </div>
      {form === "login" && <p className="slogan">Sign In</p>}
      {form === "signup" && <p className="slogan">Sign Up</p>}
      <form>
        {isValidUsername === false && form === "signup" && (
          <p className="invalid">
            {form === "signup" && <span>Username cannot be empty.</span>}
          </p>
        )}
        {form === "login" &&
          (isValidAccount === false || isValidUsername === false) && (
            <p className="invalid">Incorrect username or password.</p>
          )}
        {isDupeUsername === true &&
          isValidUsername === true &&
          form === "signup" && (
            <p className="invalid">Username already exists.</p>
          )}
        <input
          type="name"
          ref={usernameIn}
          onChange={(ev) => validateUsername(ev.target.value)}
          className="input"
          placeholder="Username"
        />
        <br />
        {isValidPassword === false && (
          <p className="invalid">
            Your password should have at least 8 characters.
          </p>
        )}
        <input
          type="password"
          ref={passwordIn}
          onChange={(ev) => validatePassword(ev.target.value)}
          className="pwd"
          placeholder="Password"
          onKeyDown={(ev) => {
            if (ev.key === "Enter" && isValidPassword) {
              if (isValidUsername) {
                submitHandler();
              } else {
                setUsernameValidation(false);
              }
            }
          }}
        />
      </form>
      <div className="decision">
        {form === "login" && (
          <div>
            <p className="text">You haven't signed up yet?</p>
            <p
              className="btn"
              onClick={() => {
                setForm("signup");
                setAccountValidation(null);
                setPasswordValidation(null);
                setUsernameValidation(null);
                setDupeValidation(null);
                usernameIn.current.value = "";
                passwordIn.current.value = "";
              }}
            >
              Create an account
            </p>
          </div>
        )}
        {form === "signup" && (
          <div>
            <p className="text">Already have an account?</p>
            <p
              className="btn"
              onClick={() => {
                setForm("login");
                setAccountValidation(null);
                setPasswordValidation(null);
                setUsernameValidation(null);
                setDupeValidation(null);
                usernameIn.current.value = "";
                passwordIn.current.value = "";
              }}
            >
              Login now
            </p>
          </div>
        )}
        <div
          className="btn2"
          onClick={() => {
            if (isValidPassword) {
              if (isValidUsername) {
                void submitHandler();
              } else {
                setUsernameValidation(false);
              }
            }
          }}
        >
          <p className="text2">{form === "signup" ? "Sign Up" : "Log In"}</p>
        </div>
      </div>
    </div>
  );
}

export default SignuploginForm;
