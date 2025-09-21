import React, { useState } from "react";
import UserContext from "./UserContext.jsx";

export default function UserProvider({ children }) {
  // initialize from localStorage so login persists after refresh
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || null;
  });

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, logout }}>
      {children}
    </UserContext.Provider>
  );
}
