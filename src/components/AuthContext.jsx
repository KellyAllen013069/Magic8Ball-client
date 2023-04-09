import React, { createContext, useEffect, useState } from 'react';
import settings from '../config/settings.json'

export const AuthContext = createContext({
  authUser: null,
  setAuthUser: () => {},
  logout: () => {}
});

function getUser(setAuthUser) {
  console.log("******about to fetch user***********")

  fetch(`https://magic8ballserver.onrender.com/api/user/getuser`, { 
    method: 'GET',
    credentials: 'include' 
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("data is " + JSON.stringify(data))
      setAuthUser(data.user);
    })
    .catch((err) => {
      console.error(err);
    });
}

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    getUser(setAuthUser);
  }, []);

  const logout = () => {
    fetch(`${settings.serverUrl}/api/user/logout`, {
        method: "GET",
        credentials: "include", // include cookies in the request
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to logout");
        } else {
        setAuthUser(null);
        }
    })
    .catch(error => console.error(error));

  };

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
