import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  // const [authInfo, setAuthInfo] = useState({
  //   isAuthenticated: false,
  //   user: null,
  // });

  const [authInfo, setAuthInfo] = useState(() => {
    const storedAuthInfo = localStorage.getItem("authInfo");
    return storedAuthInfo
      ? JSON.parse(storedAuthInfo)
      : { isAuthenticated: false, user: null };
  });

  // Update localStorage whenever authInfo changes
  useEffect(() => {
    localStorage.setItem("authInfo", JSON.stringify(authInfo));
  }, [authInfo]);

  return (
    <AuthContext.Provider value={{ authInfo, setAuthInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
