const BASE_URL = "http://localhost:8000/api";

export const createOrder = async (cartItems, shippingData) => {

    const token = localStorage.getItem("access_token");

    const items = cartItems.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    const payload = {
      items,
      shipping_address: shippingData.address,
      shipping_city: shippingData.city,
      shipping_postal_code: shippingData.postalCode,
      shipping_state: shippingData.state,
      shipping_country: shippingData.country,
      notes: shippingData.notes || "",
      discount_code: shippingData.discountCode || null,
    };

    console.log("access_token", token);

  try {
    const response = await fetch(`${BASE_URL}/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Errore backend:", errorText);
      throw new Error("Errore nella creazione dell'ordine");
    }

    return await response.json();
  } catch (error) {
    console.error("Errore createOrder:", error);
    throw error;
  }
};

//Avvia pagamento Stripe
export const initiatePayment = async (orderId) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/${orderId}/initiate-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Errore backend pagamento:", errorText);
      throw new Error("Errore nell'avvio del pagamento");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Errore initiatePayment:", error);
    throw error;
  }
};

//Conferma pagamento
export const confirmPayment = async (orderId, sessionId) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/${orderId}/confirm-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Errore backend conferma pagamento:", errorText);
      throw new Error("Errore nella conferma del pagamento");
    }

    return await response.json();
  } catch (error) {
    console.error("Errore confirmPayment:", error);
    throw error;
  }
};

// Ottieni dettagli ordine
export const getOrderDetails = async (orderId) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/${orderId}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Errore backend getOrderDetails:", errorText);
      throw new Error("Ordine non trovato");
    }

    return await response.json();
  } catch (error) {
    console.error("Errore getOrderDetails:", error);
    throw error;
  }
};
