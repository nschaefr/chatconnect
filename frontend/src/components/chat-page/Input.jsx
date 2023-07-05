import React from "react";
import Img from "../../assets/pictures/image(1).png"
import Attach from"../../assets/pictures/attach-paperclip-symbol.png"


function Input() {
    return (
        <div className="messageInputContainer">
            <input type="text" placeholder="message" className="messageInput"/>
            <div className="sendContainer">
                <img src={Attach} alt="" className="sendContainerImg"/>
                <input type="file" style={{display: "none"}} id="file"/>
                <label htmlFor="file">
                    <img src={Img} alt="" className="sendContainerImg"/>
                </label>
                <button className="sendButton">Send</button>
            </div>
        </div>
    );
}

export default Input;