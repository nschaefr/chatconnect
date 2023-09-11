import { useContext } from "react";
import { UserContext } from "./components/utils/user-context";
import ChatPage from "./pages/chat-page/chat-page";
import SignuploginPage from "./pages/signuplogin-page/signuplogin-page";

/**
 * A Function which decides if the ChatPage or the Signuploginpage should be shown
 * @component
 */
function Routes() {
  const { username } = useContext(UserContext);

  if (username) {
    return <ChatPage />;
  }

  return <SignuploginPage />;
}

export default Routes;
