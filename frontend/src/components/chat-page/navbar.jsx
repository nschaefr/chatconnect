import React, { useContext } from "react";
import "./chat.css";
import { UserContext } from "../utils/user-context";

function Navbar() {
  const { username, id } = useContext(UserContext);

  return (
    <div className="navbar">
      <span className="header">ChatConnect</span>
      <div className="user">
        <img
          className="profilePicture"
          src="https://www.ruehl24.de/images/product_images/original_images/Ruehls_Bestes_Shirt_IMG_0070.jpg"
          alt=""
        />
        <span>{username}</span>
        <button className="logout-button">Logout</button>
      </div>
    </div>
  );
}

export default Navbar;
