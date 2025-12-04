// URL base del backend
const BASE_URL = "http://localhost:8000/api";

// Registrazione nuovo utente
export const register = async (userData) => {
  try {
    // Invio richiesta POST al backend con i dati dell'utente
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST", // POST perché stiamo creando un nuovo utente
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

    // Salvo token e dati utente nel localStorage
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data; // Ritorno i dati al chiamante della funzione
  } catch (error) {
    console.error("Errore registrazione:", error);
    throw error;
  }
};

// Login utente
export const login = async (email, password) => {
  try {
    // Invio richiesta POST al backend con email e password
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

    const data = await response.json(); // Leggo i dati dal server

    // Salvo token e utente nel localStorage
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error("Errore login:", error);
    throw error;
  }
};

// Logout utente
export const logout = () => {
  // Rimuovo token e dati utente dal localStorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};

// Controlla se l'utente è loggato
export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token"); // Prendo il token dal localStorage
  return !!token; // Se c'è token ritorna true, altrimenti false
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
    const token = getToken(); // Prendo il token dal localStorage
    if (!token) return null;

    // Invio richiesta GET al backend per verificare token
    const response = await fetch(`${BASE_URL}/users/verify-token`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Passo il token nell'header Authorization
      },
    });

    if (!response.ok) {
      logout(); // Se token non valido, faccio logout
      return null;
    }

    const data = await response.json();
    return data.user; // Ritorno l'utente verificato
  } catch (error) {
    console.error("Errore verifica token:", error);
    logout(); // In caso di errore, faccio logout
    return null;
  }
};
