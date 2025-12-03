const BASE_URL = "http://localhost:8000/api";

// Registrazione nuovo utente
export const register = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Errore nella registrazione");
    }

    const data = await response.json();
    
    // Salva token e user in localStorage
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error("Errore registrazione:", error);
    throw error;
  }
};

// Login utente
export const login = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Email o password non corretti");
    }

    const data = await response.json();
    
    // Salva token e user in localStorage
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error("Errore login:", error);
    throw error;
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};

// Verifica se utente è loggato
export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  return !!token;
};

// Ottieni utente corrente
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Ottieni token
export const getToken = () => {
  return localStorage.getItem("access_token");
};

// Verifica token con backend
export const verifyToken = async () => {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await fetch(`${BASE_URL}/users/verify-token`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      logout();
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Errore verifica token:", error);
    logout();
    return null;
  }
};
