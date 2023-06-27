import React from "react";
import "../signup-page/signup-form.css";

function LoginForm() {
    return (
        <div className="form">
            <p className="slogan">Log in to your ChatConnect Account.</p>
            <form>
                <input type="name" className="input2" placeholder="Username" />
                <br />
                <input type="password" className="pwd" placeholder="Password" />
            </form>
            <div className="decision">
                <div className="btn2">
                    <p className="text2">LogIn</p>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;