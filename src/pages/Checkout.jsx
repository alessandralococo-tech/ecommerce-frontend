import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { createOrder, initiatePayment } from "../api/orders";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    state: "",
    country: "Italy",
    notes: "",
    discountCode: ""
  });

  const [errors, setErrors] = useState({});

  // Richiedi login
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [isAuthenticated, navigate]);

  // Stelle animate
  useEffect(() => {
    if (cardRef.current) {
      const { offsetWidth, offsetHeight } = cardRef.current;
      const tempStars = Array.from({ length: 20 }).map(() => ({
        left: Math.random() * offsetWidth,
        top: Math.random() * offsetHeight,
        size: Math.random() * 10 + 5,
        delay: Math.random() * 2,
      }));
      setStars(tempStars);
    }
  }, []);

  // Redirect se carrello vuoto
  useEffect(() => {
    if (cart.items.length === 0) {
      navigate("/cart");
    }
  }, [cart.items.length, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.address || formData.address.trim().length < 5) {
      newErrors.address = "Inserisci un indirizzo valido (min 5 caratteri)";
    }
    if (!formData.city || formData.city.trim().length < 2) {
      newErrors.city = "Inserisci una città valida";
    }
    if (!formData.postalCode || !/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Inserisci un CAP valido (5 cifre)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Compila correttamente tutti i campi obbligatori");
      return;
    }

    setLoading(true);

    try {
      // FASE 1: Crea ordine (status: PENDING)
      const order = await createOrder(cart.items, formData);
      console.log("✅ Ordine creato:", order);

      // FASE 2: Avvia pagamento Stripe
      const paymentData = await initiatePayment(order.id);
      console.log("✅ Pagamento avviato:", paymentData);

      // Salva order_id per dopo
      localStorage.setItem("pending_order_id", order.id);

      // Svuota carrello prima del redirect
      clearCart();

      // Redirect a Stripe Checkout
      window.location.href = paymentData.checkout_url;

    } catch (error) {
      console.error("Errore checkout:", error);
      alert("Errore durante il checkout: " + error.message);
      setLoading(false);
    }
  };

  const subtotal = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
  const shippingCost = subtotal >= 50 ? 0 : 5;
  const total = subtotal + shippingCost;

  if (cart.items.length === 0) {
    return null; // Il redirect è già gestito dall'useEffect
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", position: "relative" }}>
      <button
        onClick={() => navigate("/cart")}
        style={{
          marginBottom: "30px",
          padding: "10px 20px",
          background: "rgba(255, 77, 171, 0.1)",
          border: "2px solid #ff4dab",
          borderRadius: "10px",
          color: "#ff4dab",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "600",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#ff4dab"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 77, 171, 0.1)"; e.currentTarget.style.color = "#ff4dab"; }}
      >
        ← Torna al carrello
      </button>

      <h1 style={{ fontSize: "2.5rem", color: "#2d2d2d", marginBottom: "30px", fontWeight: "700" }}>
        ✨ Checkout
      </h1>

      <div
        ref={cardRef}
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "40px",
          background: "linear-gradient(145deg, #ffffff, #fff5f9)",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(255, 77, 171, 0.2)",
          border: "2px solid rgba(255, 121, 198, 0.2)",
          overflow: "hidden",
        }}
      >
        {/* Stelle animate */}
        {stars.map((star, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              backgroundColor: "#FFD700",
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              opacity: 0,
              animation: `twinkle 2s ${star.delay}s infinite`,
            }}
          />
        ))}

        {/* Form Spedizione */}
        <div>
          <h2 style={{ color: "#ff4dab", fontSize: "1.8rem", marginBottom: "25px" }}>
            📦 Dati di spedizione
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          </form>
        </div>

        {/* Riepilogo Ordine */}
        <div>
          <h2 style={{ color: "#ff4dab", fontSize: "1.8rem", marginBottom: "25px" }}>
            📋 Riepilogo ordine
          </h2>

          {/* Bottone Paga */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "25px",
              padding: "18px",
              background: loading ? "#ccc" : "linear-gradient(90deg, #ff4dab, #ff79c6)",
              border: "none",
              borderRadius: "15px",
              color: "#fff",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "1.2rem",
              boxShadow: loading ? "none" : "0 6px 20px rgba(255, 77, 171, 0.4)",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 77, 171, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 77, 171, 0.4)";
              }
            }}
          >
            {loading ? "Reindirizzamento a Stripe..." : "💳 Procedi al pagamento"}
          </button>

          <p style={{
            marginTop: "15px",
            fontSize: "0.85rem",
            color: "#666",
            textAlign: "center"
          }}>
            🔒 Pagamento sicuro con Stripe
          </p>
        </div>
      </div>

      {/* Animazioni */}
      <style>{`
        @keyframes twinkle {
          0%,100% {opacity: 0; transform: scale(0.5);}
          50% {opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}
