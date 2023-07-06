import { createContext, useState } from "react";

export const UserContext = createContext({});

export function ContextProvider({ children }) {
  const [username, setLoggedInUsername] = useState();
  const [id, setId] = useState();

  return (
    <UserContext.Provider value={{ username, setLoggedInUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
