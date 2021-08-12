import React, { createContext, useState } from "react";
export const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [user, setUser] = useState();
  const value = {
    socket,
    setSocket,
    user,
    setUser,
  };
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
