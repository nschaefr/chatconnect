import Chats from "../../components/chat-page/chats";
import Chat from "../../components/chat-page/chat";
import "./chat-page.css";

function ChatPage() {
  return (
    <div className="page">
      <div className="container">
        <Chats />
        <Chat />
      </div>
    </div>
  );
}

export default ChatPage;
