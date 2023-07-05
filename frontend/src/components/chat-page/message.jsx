import React from "react";
import "./chat.css"

function Message() {
    return (
        <div className="messageContainerOwner">
            <div className="messageInfo">
                <img  className="messageInfoPic" src="https://www.ruehl24.de/images/product_images/original_images/Ruehls_Bestes_Shirt_IMG_0070.jpg" alt=""/>
                <span>just now</span>
            </div>
            <div className="messageContent">
                <p className="messageOwner">hello</p>
                {/*<img className="messagePic"
                      src="https://www.ruehl24.de/images/product_images/original_images/Ruehls_Bestes_Shirt_IMG_0070.jpg"
                      alt=""/>*/}
            </div>

        </div>
    );
}

export default Message;