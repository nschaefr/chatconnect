import React from "react";
import "./chat.css"
import More from "../../assets/pictures/more.png";
import Add from "../../assets/pictures/add.png";
import Cam from "../../assets/pictures/cam-recorder.png";
import Messages from "./messages";
import Input from "./input";


function Chat() {
    return (
        <div className="chat">
            <div className="chatUserInfo">
                <span>Jay</span>
                <div className="chatIconsContainer">
                    <img src={Cam} alt="" className="chatIcons"/>
                    <img src={Add} alt="" className="chatIcons"/>
                    <img src={More} alt="" className="chatIcons"/>
                </div>
            </div>
            <Messages/>
            <Input/>
        </div>
    );
}

export default Chat;