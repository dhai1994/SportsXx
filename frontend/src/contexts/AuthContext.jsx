import { createContext, useState, useEffect, useContext } from "react";
import API from "../api";

const AuthContext = createContext();//TO HANDLE USER LOGIN OR NOT GLOBALLY FOR DIFFERENT ROUTES

export const AuthProvider = ({ children }) => {
const [isLoggedIn, setIsLoggedIn] = useState(true);
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await API.get("/users/me");
        setIsLoggedIn(true);
        setUser(res.data.user);
        console.log("User fetched in AuthContext:", res.data)
        localStorage.setItem("isLoggedIn", "true");//refesh ke time bhi yaad rahe logged in h user already
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err) {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("user");
      } 
      finally{
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

const logout = async () =>{
  await API.get("/users/logout", { withCredentials: true });
  setIsLoggedIn(false);
  setUser(null);
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("user");
};

return (
  <AuthContext.Provider value={{ isLoggedIn, user, setIsLoggedIn, setUser, logout, loading }}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);
