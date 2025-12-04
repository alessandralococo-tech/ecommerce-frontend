const BASE_URL = "http://localhost:8000/api";

// Funzione che ritorna gli headers per le richieste che richiedono autenticazione
const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}` // Token per autenticare l'admin
});

// ==================== ENDPOINT ADMIN ====================
// Tutti questi endpoint richiedono il token di un admin

// Recupera tutti gli utenti (admin)
export async function getUsers(token) {
  try {
    // Richiesta GET al backend per ottenere tutti gli utenti
    const res = await fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` } // Passo token per autenticazione
    });
    
    if (res.status === 401) {
      // Token mancante o non valido
      throw new Error("Non autorizzato - effettua il login come admin");
    }
    if (!res.ok) {
      // Altri errori dal backend
      const errorData = await res.json();
      throw new Error(errorData.detail || "Errore nel fetch degli utenti");
    }
    
    return await res.json(); // Ritorno lista utenti
  } catch (error) {
    console.error("Errore getUsers:", error);
    throw error;
  }
}

// Recupera un singolo utente per id (admin)
export async function getUserById(id, token) {
  try {
    // Richiesta GET al backend per ottenere un utente specifico
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (res.status === 401) {
      throw new Error("Non autorizzato - effettua il login come admin");
    }
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Utente non trovato");
    }
    
    return await res.json(); // Ritorno dati utente
  } catch (error) {
    console.error("Errore getUserById:", error);
    throw error;
  }
}

// Elimina un utente (admin)
export async function deleteUser(id, token) {
  try {
    // Richiesta DELETE al backend per eliminare un utente
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (res.status === 401) {
      throw new Error("Non autorizzato - effettua il login come admin");
    }
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Errore nell'eliminazione dell'utente");
    }
    
    return true; // Ritorno true se eliminazione avvenuta con successo
  } catch (error) {
    console.error("Errore deleteUser:", error);
    throw error;
  }
}

// Aggiorna un utente (admin)
export async function updateUser(id, userData, token) {
  try {
    // Richiesta PUT al backend per aggiornare un utente
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(userData)
    });
    
    if (res.status === 401) {
      throw new Error("Non autorizzato - effettua il login come admin");
    }
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Errore nell'aggiornamento dell'utente");
    }
    
    return await res.json(); // Ritorno dati utente aggiornati
  } catch (error) {
    console.error("Errore updateUser:", error);
    throw error;
  }
}