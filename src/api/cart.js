const BASE_URL = "http://localhost:8000/api";

// Crea un ordine chiamando il backend
export const createOrder = async (cartItems, shippingData) => {
  const token = localStorage.getItem("access_token");
  const items = cartItems.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

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
    const response = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("ciao");
    }

    return await response.json();
  } catch (error) {
    console.error("Errore:", error);
    throw error;
  }
};