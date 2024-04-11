import axios from "axios";
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  axios.defaults.headers.common['Authorization'] = auth?.token

  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      setAuth({
        ...auth,
        user: JSON.parse(sessionStorage.getItem("user")),
        token: JSON.parse(sessionStorage.getItem("token")),
        // toggle: true
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// custom Hooks
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
