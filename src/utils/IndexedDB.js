const DB_NAME = "StarShopDB"; // nome del database
const STORE_NAME = "cart";    // nome dello store

// Funzione per aprire il database
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1); // versione 1 del DB

    // Se il DB non esiste o cambia versione, viene chiamato onupgradeneeded
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Crea lo store se non esiste già
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" }); 
        // keyPath "id" serve per identificare univocamente ogni record
      }
    };

    // Se l'apertura va a buon fine
    request.onsuccess = () => resolve(request.result);

    // Se c'è un errore nell'apertura
    request.onerror = () => reject(request.error);
  });
};

// Salva il carrello nel database
export const saveCartToDB = async (cartItems) => {
  try {
    const db = await openDB(); // apri il DB
    const tx = db.transaction(STORE_NAME, "readwrite"); // transazione in scrittura
    const store = tx.objectStore(STORE_NAME);           // accedi allo store
    store.put({ id: "cart", items: cartItems });        // salva il carrello con id cart
    await tx.complete; // aspetta che la transazione finisca
  } catch (error) {
    console.error("Errore salvataggio:", error); // log errore se qualcosa va storto
  }
};

// Leggi il carrello dal database
export const getCartFromDB = async () => {
  try {
    const db = await openDB(); // apri il DB
    const tx = db.transaction(STORE_NAME, "readonly"); // transazione in sola lettura
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve) => {
      const request = store.get("cart"); // recupera l'oggetto con id cart
      request.onsuccess = () => {
        const result = request.result;
        // se esiste, restituisci items, altrimenti array vuoto
        resolve(result ? result.items : []);
      };
      request.onerror = () => resolve([]); // in caso di errore restituisci array vuoto
    });
  } catch (error) {
    console.error("Errore lettura:", error);
    return []; // fallback
  }
};

// Svuota il carrello nel database
export const clearCartInDB = async () => {
  try {
    const db = await openDB(); // apri il DB
    const tx = db.transaction(STORE_NAME, "readwrite"); // transazione in scrittura
    const store = tx.objectStore(STORE_NAME);
    store.delete("cart"); // cancella l'oggetto con id cart
    await tx.complete;    // aspetta che la transazione finisca
  } catch (error) {
    console.error("Errore cancellazione:", error);
  }
};
