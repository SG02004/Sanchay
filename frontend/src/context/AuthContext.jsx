/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", { name, email, password });

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
