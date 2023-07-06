import React from "react";
import Sidebar from "../../components/chat-page/sidebar";
import Chat from "../../components/chat-page/chat";
import "./chat-page.css";


function ChatPage() {
    return (
        <div className="page">
            <div className="container">
                <Sidebar />
                <Chat />
            </div>
        </div>
    );
}

export default ChatPage;