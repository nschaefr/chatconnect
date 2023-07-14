import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function ContextProvider({ children }) {
  const [username, setLoggedInUsername] = useState();
  const [id, setId] = useState();
  useEffect(() => {
    axios.get("/profile").then((response) => {
      setId(response.data.id);
      setLoggedInUsername(response.data.username);
    });
  }, []);

  return (
    <UserContext.Provider value={{ username, setLoggedInUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
