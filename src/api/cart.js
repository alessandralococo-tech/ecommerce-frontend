const BASE_URL = "http://localhost:8000/api";

// Crea un ordine chiamando il backend
export const createOrder = async (cartItems, shippingData) => {
  // Prendo il token salvato nel localStorage
  const token = localStorage.getItem("access_token");

  // Creo un array di oggetti con product_id e quantità dagli articoli del carrello
  const items = cartItems.map((item) => ({
    product_id: item.product.id, // ID del prodotto
    quantity: item.quantity,      // Quantità
  }));

  // Creo il payload
  // Uso valori di default se shippingData non ha alcuni campi
  const payload = {
    items,                                   
    shipping_address: shippingData.address || "Via fiume 123", 
    shipping_city: shippingData.city || "Roma", 
    shipping_postal_code: shippingData.postalCode || "00100",
    shipping_state: shippingData.state || "RM",
    shipping_country: shippingData.country || "Italy", 
    notes: shippingData.notes || "",  
    discount_code: shippingData.discountCode || null, 
  };

  try {
    // Invio richiesta POST al backend per creare l'ordine
    const response = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload), 
    });

    if (!response.ok) {
      throw new Error("Errore nella creazione dell'ordine");
    }

    return await response.json();
  } catch (error) {
    console.error("Errore:", error);
    throw error;
  }
};