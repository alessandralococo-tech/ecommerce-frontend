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

    // Verifica che l'utente sia ancora autenticato
    if (!isAuthenticated()) {
      alert("Sessione scaduta. Effettua nuovamente il login.");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    // Verifica che esista il token
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Sessione non valida. Effettua nuovamente il login.");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    if (!validateForm()) {
      alert("Compila correttamente tutti i campi obbligatori");
      return;
    }

    setLoading(true);

    try {
      // FASE 1: Crea ordine (status: PENDING)
      const order = await createOrder(cart.items, formData);
      console.log("✅ Ordine creato:", order);

      // FASE 2: Avvia pagamento Stripe (passando i dati di spedizione)
      const paymentData = await initiatePayment(order.id, formData);
      console.log("✅ Pagamento avviato:", paymentData);

      // Salva order_id per dopo
      localStorage.setItem("pending_order_id", order.id);

      // Svuota carrello prima del redirect
      clearCart();

      // Redirect a Stripe Checkout
      window.location.href = paymentData.checkout_url;

    } catch (error) {
      console.error("Errore checkout:", error);
      
      // Gestione specifica per errori di autenticazione
      if (error.message.includes("authenticated") || error.message.includes("403")) {
        alert("Sessione scaduta. Effettua nuovamente il login.");
        navigate("/login", { state: { from: "/checkout" } });
      } else {
        alert("Errore durante il checkout: " + error.message);
      }
      
      setLoading(false);
    }
  };

  const subtotal = cart.items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
  const shippingCost = subtotal >= 50 ? 0 : 5;
  const total = subtotal + shippingCost;

  if (cart.items.length === 0) {
    return null;
  }

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "2px solid rgba(255, 121, 198, 0.3)",
    borderRadius: "10px",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s",
    color: "#2d2d2d",
    boxSizing: "border-box"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#2d2d2d"
  };

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
        onMouseEnter={(e) => { 
          e.currentTarget.style.background = "#ff4dab"; 
          e.currentTarget.style.color = "#fff"; 
        }}
        onMouseLeave={(e) => { 
          e.currentTarget.style.background = "rgba(255, 77, 171, 0.1)"; 
          e.currentTarget.style.color = "#ff4dab"; 
        }}
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
            {/* Indirizzo */}
            <div>
              <label style={labelStyle}>Indirizzo *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Via Roma 123"
                required
                style={{
                  ...inputStyle,
                  border: errors.address ? "2px solid #ef4444" : "2px solid rgba(255, 121, 198, 0.3)"
                }}
                onFocus={(e) => e.target.style.borderColor = "#ff4dab"}
                onBlur={(e) => e.target.style.borderColor = errors.address ? "#ef4444" : "rgba(255, 121, 198, 0.3)"}
              />
              {errors.address && (
                <p style={{ color: "#ef4444", fontSize: "0.9rem", marginTop: "5px", margin: "5px 0 0 0" }}>
                  {errors.address}
                </p>
              )}
            </div>

            {/* Città */}
            <div>
              <label style={labelStyle}>Città *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Roma"
                required
                style={{
                  ...inputStyle,
                  border: errors.city ? "2px solid #ef4444" : "2px solid rgba(255, 121, 198, 0.3)"
                }}
                onFocus={(e) => e.target.style.borderColor = "#ff4dab"}
                onBlur={(e) => e.target.style.borderColor = errors.city ? "#ef4444" : "rgba(255, 121, 198, 0.3)"}
              />
              {errors.city && (
                <p style={{ color: "#ef4444", fontSize: "0.9rem", marginTop: "5px", margin: "5px 0 0 0" }}>
                  {errors.city}
                </p>
              )}
            </div>

            {/* CAP e Provincia */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={labelStyle}>CAP *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="00100"
                  required
                  maxLength="5"
                  style={{
                    ...inputStyle,
                    border: errors.postalCode ? "2px solid #ef4444" : "2px solid rgba(255, 121, 198, 0.3)"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#ff4dab"}
                  onBlur={(e) => e.target.style.borderColor = errors.postalCode ? "#ef4444" : "rgba(255, 121, 198, 0.3)"}
                />
                {errors.postalCode && (
                  <p style={{ color: "#ef4444", fontSize: "0.9rem", marginTop: "5px", margin: "5px 0 0 0" }}>
                    {errors.postalCode}
                  </p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Provincia</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="RM"
                  maxLength="2"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = "#ff4dab"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255, 121, 198, 0.3)"}
                />
              </div>
            </div>

            {/* Paese */}
            <div>
              <label style={labelStyle}>Paese *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                style={{
                  ...inputStyle,
                  cursor: "pointer"
                }}
                onFocus={(e) => e.target.style.borderColor = "#ff4dab"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255, 121, 198, 0.3)"}
              >
                <option value="Italy">Italia</option>
                <option value="France">Francia</option>
                <option value="Germany">Germania</option>
                <option value="Spain">Spagna</option>
              </select>
            </div>

            {/* Note */}
            <div>
              <label style={labelStyle}>Note (opzionale)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Suona il campanello, scala B..."
                rows="3"
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  fontFamily: "inherit"
                }}
                onFocus={(e) => e.target.style.borderColor = "#ff4dab"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255, 121, 198, 0.3)"}
              />
            </div>

            {/* Codice sconto */}
            <div>
              <label style={labelStyle}>Codice sconto (opzionale)</label>
              <input
                type="text"
                name="discountCode"
                value={formData.discountCode}
                onChange={handleChange}
                placeholder="SUMMER2024"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = "#ff4dab"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255, 121, 198, 0.3)"}
              />
            </div>
          </form>
        </div>

        {/* Riepilogo Ordine */}
        <div>
          <h2 style={{ color: "#ff4dab", fontSize: "1.8rem", marginBottom: "25px" }}>
            📋 Riepilogo ordine
          </h2>

          {/* Lista prodotti */}
          <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
            {cart.items.map((item) => (
              <div 
                key={item.product.id} 
                style={{
                  display: "flex",
                  gap: "15px",
                  marginBottom: "15px",
                  padding: "10px",
                  background: "rgba(255, 77, 171, 0.05)",
                  borderRadius: "10px"
                }}
              >
                <img
                  src={item.product.image_url || "https://via.placeholder.com/60"}
                  alt={item.product.name}
                  style={{ 
                    width: "60px", 
                    height: "60px", 
                    objectFit: "cover", 
                    borderRadius: "8px" 
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 5px 0", fontWeight: "600", color: "#2d2d2d" }}>
                    {item.product.name}
                  </p>
                  <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                    €{item.product.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p style={{ fontWeight: "bold", color: "#ff4dab" }}>
                  €{(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Totali */}
          <div style={{ borderTop: "2px solid rgba(255, 121, 198, 0.2)", paddingTop: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ color: "#666" }}>Subtotale:</span>
              <strong>€{subtotal.toFixed(2)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ color: "#666" }}>Spedizione:</span>
              <strong style={{ color: shippingCost === 0 ? "#10b981" : "#2d2d2d" }}>
                {shippingCost === 0 ? "GRATIS ✓" : `€${shippingCost.toFixed(2)}`}
              </strong>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              paddingTop: "15px",
              borderTop: "2px solid rgba(255, 121, 198, 0.2)"
            }}>
              <span style={{ fontSize: "1.3rem", fontWeight: "700" }}>Totale:</span>
              <strong style={{ fontSize: "2rem", color: "#ff4dab" }}>€{total.toFixed(2)}</strong>
            </div>
          </div>

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

        input::placeholder,
        textarea::placeholder {
          color: #aaa;
        }
      `}</style>
    </div>
  );
}