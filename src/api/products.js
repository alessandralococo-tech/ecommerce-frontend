// URL base del backend
const BASE_URL = "http://localhost:8000/api";

// Funzione che ritorna gli headers per le richieste che richiedono autenticazione
const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
});

// ==================== ENDPOINTS PUBBLICI ====================

// Lista prodotti (pubblico senza token)
export async function getProducts() {
  try {
    // Richiesta GET al backend per ottenere tutti i prodotti
    const res = await fetch(`${BASE_URL}/products`);
    
    if (!res.ok) throw new Error("Errore nel fetch dei prodotti");
    
    return await res.json();
  } catch (error) {
    console.error(error);
    return []; // In caso di errore ritorno array vuoto
  }
}

// Dettaglio prodotto (sempre senza token)
export async function getProductById(id) {
  try {
    // Richiesta GET al backend per ottenere un prodotto specifico
    const res = await fetch(`${BASE_URL}/products/${id}`);
    
    if (!res.ok) throw new Error("Prodotto non trovato"); // Se prodotto non esiste
    
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// ==================== ENDPOINTS ADMIN ====================
//Richiedono il token

// crea prodotto (solo admin)
export async function createProduct(productData, token) {
  try {
    // Richiesta POST al backend per creare un prodotto
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify(productData)
    });
    
    if (res.status === 401) {
      throw new Error("Non autorizzato - effettua il login come admin"); // Token non valido
    }
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Errore nella creazione del prodotto");
    }
    
    return await res.json(); // Ritorno il prodotto creato
  } catch (error) {
    console.error("Errore createProduct:", error);
    throw error;
  }
}

// Aggiorna prodotto (solo admin)
export async function updateProduct(id, productData, token) {
  try {
    // Richiesta PUT al backend per aggiornare un prodotto
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(productData)
    });
    
    if (res.status === 401) {
      throw new Error("Non autorizzato - effettua il login come admin");
    }
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Errore nell'aggiornamento del prodotto");
    }
    
    return await res.json(); // Ritorno prodotto aggiornato
  } catch (error) {
    console.error("Errore updateProduct:", error);
    throw error;
  }
}

// Cancella prodotto (solo admin)
export async function deleteProduct(id, token) {
  try {
    // Richiesta DELETE al backend per eliminare un prodotto
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` } // Passo token manualmente
    });
    
    if (res.status === 401) {
      throw new Error("Non autorizzato - effettua il login come admin");
    }
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Errore nella cancellazione del prodotto");
    }
    
    return true; // Ritorno true se eliminazione avvenuta con successo
  } catch (error) {
    console.error("Errore deleteProduct:", error);
    throw error;
  }
}
