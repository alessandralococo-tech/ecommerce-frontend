import React, { createContext, useContext, useState, useEffect } from "react";
// Import delle funzioni API per login, registrazione, logout, token
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser, verifyToken } from "../api/auth";

// ==================== CREAZIONE DEL CONTEXT ====================
const AuthContext = createContext();

// ==================== PROVIDER ====================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================== USE EFFECT ALL'AVVIO ====================
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("user"); // controllo se c'è un utente salvato
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const verified = await verifyToken(parsedUser.token); // verifica token lato backend
        if (verified) {
          setUser(parsedUser); // se token valido setto l'utente altrimenti lo rimuovo
        } else {
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // ==================== LOGIN ====================
  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password); // chiamo API login
      const loggedUser = { ...data.user, token: data.access_token }; // aggiungo token all'oggetto utente
      setUser(loggedUser); // aggiorno stato
      localStorage.setItem("user", JSON.stringify(loggedUser)); // salvo su localStorage
      return loggedUser;
    } catch (error) {
      throw error;
    }
  };

  // ==================== REGISTER ====================
  const register = async (userData) => {
    try {
      const data = await apiRegister(userData); // chiamo API register
      const registeredUser = { ...data.user, token: data.access_token };
      setUser(registeredUser); // aggiorno stato
      localStorage.setItem("user", JSON.stringify(registeredUser)); // salvo su localStorage
      return registeredUser;
    } catch (error) {
      throw error;
    }
  };

  // ==================== LOGOUT ====================
  const logout = () => {
    apiLogout(); // pulisco token lato API/localStorage
    setUser(null); // reset dello stato
    localStorage.removeItem("user"); // rimuovo da localStorage
  };

  // ==================== VERIFICA AUTENTICAZIONE ====================
  const isAuthenticated = () => !!user;

  // ==================== PROVIDER ====================
  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ==================== CUSTOM HOOK ====================
export const useAuth = () => {
  const context = useContext(AuthContext); // Recupero il contesto
  if (!context) throw new Error("useAuth deve essere usato dentro il provider");
  return context;
};
