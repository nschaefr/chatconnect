import axios from "axios";
import { ContextProvider } from "./components/utils/user-context";
import Routes from "./Routes.jsx";
/**
 * Landing Page
 */
function App() {
  axios.defaults.baseURL = "http://localhost:4040";
  axios.defaults.withCredentials = true;
  return (
    <ContextProvider>
      <Routes />
    </ContextProvider>
  );
}

export default App;
