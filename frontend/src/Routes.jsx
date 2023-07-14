import { useContext } from "react";
import { UserContext } from "./components/utils/user-context";
import ChatPage from "./pages/chat-page/chat-page";
import SignuploginPage from "./pages/signuplogin-page/signuplogin-page";

export default function Routes() {
  const { username } = useContext(UserContext);

  if (username) {
    return <ChatPage />;
  }

  return <SignuploginPage />;
}
