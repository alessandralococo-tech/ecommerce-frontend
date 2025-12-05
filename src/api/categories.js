// URL base del backend
const BASE_URL = "http://localhost:8000/api";

// ==================== CATEGORIE ====================

// Ottieni tutte le categorie (pubblico, no token)
export async function getCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    
    if (!res.ok) throw new Error("Errore nel caricamento delle categorie");
    
    return await res.json();
  } catch (error) {
    console.error("Errore getCategories:", error);
    return []; // Array vuoto in caso di errore
  }
}

// Ottieni una categoria per ID (pubblico, no token)
export async function getCategoryById(id) {
  try {
    const res = await fetch(`${BASE_URL}/categories/${id}`);
    
    if (!res.ok) throw new Error("Categoria non trovata");
    
    return await res.json();
  } catch (error) {
    console.error("Errore getCategoryById:", error);
    return null;
  }
}

// ==================== ADMIN - GESTIONE CATEGORIE ====================

// Crea una nuova categoria (solo admin)
export async function createCategory(categoryData, token) {
  try {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
    
    if (res.status === 401) {
      throw new Error("Non autorizzato - effettua il login come admin");
    }
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Errore nella creazione della categoria");
    }
    
    return await res.json();
  } catch (error) {
    console.error("Errore createCategory:", error);
    throw error;
  }
}