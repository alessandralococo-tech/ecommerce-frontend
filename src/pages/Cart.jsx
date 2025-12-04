import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function Cart() {
  // Recupera dati e funzioni del carrello dal context
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  // Riferimento al contenitore della card usato per posizionare le stelle animate
  const cardRef = useRef(null);
  // Stato per contenere la lista delle stelline animate
  const [stars, setStars] = React.useState([]);

  //  ANIMAZIONE STELLE
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
  }, [cart.items.length]); // dipende dal numero di articoli

  // Per andare alla pagina di checkout
  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Calcola totale
  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  // Spedizione gratuita (sopra i 50)
  const shippingCost = subtotal >= 50 ? 0 : 5;

  // Totale finale ordine
  const total = subtotal + shippingCost;

  //  CASO CARRELLO VUOTO
  if (cart.items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "5rem", marginBottom: "20px" }}>🛒</div>

        <h2 style={{ color: "#ff4dab", marginBottom: "15px" }}>
          Il tuo carrello è vuoto
        </h2>

        <p style={{ color: "#666", marginBottom: "30px" }}>
          Aggiungi alcuni prodotti fantastici! ⭐
        </p>

        {/* Bottone che porta allo shop */}
        <button
          onClick={() => navigate("/shop")}
          style={{
            padding: "14px 28px",
            background: "linear-gradient(90deg, #ff4dab, #ff79c6)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "1.1rem",
            boxShadow: "0 4px 15px rgba(255, 77, 171, 0.3)",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Vai allo shop
        </button>
      </div>
    );
  }

  //  CARRELLO PIENO
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", position: "relative" }}>

      {/* Pulsante torna allo shop */}
      <button
        onClick={() => navigate("/shop")}
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
        ← Torna ai prodotti
      </button>

      {/* Titolo */}
      <h1 style={{ fontSize: "2.5rem", color: "#2d2d2d", marginBottom: "30px", fontWeight: "700" }}>
        🛒 Il tuo carrello ({cart.items.length} {cart.items.length === 1 ? "prodotto" : "prodotti"})
      </h1>

      {/* Contenitore principale con prodotti + riepilogo */}
      <div
        ref={cardRef}
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "40px",
          background: "linear-gradient(145deg, #ffffff, #fff5f9)",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(255, 77, 171, 0.2)",
          border: "2px solid rgba(255, 121, 198, 0.2)",
          overflow: "hidden",
        }}
      >

        {/* STELLE ANIMATE SULLO SFONDO */}
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
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              opacity: 0,
              animation: `twinkle 2s ${star.delay}s infinite`,
            }}
          />
        ))}

        {/* LISTA PRODOTTI */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {cart.items.map((item) => (
            <div
              key={item.product.id}
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                background: "rgba(255, 77, 171, 0.05)",
                padding: "20px",
                borderRadius: "15px",
                border: "1px solid rgba(255, 121, 198, 0.1)",
              }}
            >

              {/* IMMAGINE PRODOTTO */}
              <img
                src={item.product.image_url || "https://via.placeholder.com/100"}
                alt={item.product.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/products/${item.product.id}`)}
              />

              {/* INFO PRODOTTO */}
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: "0 0 5px 0",
                    color: "#ff4dab",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                  }}
                  onClick={() => navigate(`/products/${item.product.id}`)}
                >
                  {item.product.name}
                </h3>

                <p style={{ margin: "5px 0", color: "#999", fontSize: "0.9rem" }}>
                  SKU: {item.product.sku}
                </p>

                {/* Prezzo × quantità */}
                <p style={{ margin: "5px 0", fontWeight: "bold", fontSize: "1.2rem" }}>
                  €{item.product.price.toFixed(2)} × {item.quantity}
                </p>

                {/* GESTIONE QUANTITÀ */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                  {/* Riduci quantità */}
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    style={{
                      width: "30px",
                      height: "30px",
                      background: "#ff4dab",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    -
                  </button>

                  {/* Quantità attuale */}
                  <span style={{ minWidth: "30px", textAlign: "center", fontWeight: "600", fontSize: "1.1rem" }}>
                    {item.quantity}
                  </span>

                  {/* Aumenta quantità */}
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.available_quantity}
                    style={{
                      width: "30px",
                      height: "30px",
                      background:
                        item.quantity >= item.product.available_quantity ? "#ccc" : "#ff4dab",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor:
                        item.quantity >= item.product.available_quantity ? "not-allowed" : "pointer",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* PREZZO TOTALE + RIMOZIONE */}
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: "0 0 10px 0", fontWeight: "bold", fontSize: "1.4rem", color: "#ff4dab" }}>
                  €{(item.product.price * item.quantity).toFixed(2)}
                </p>

                {/* Pulsante rimuovi */}
                <button
                  onClick={() => removeItem(item.product.id)}
                  style={{
                    padding: "8px 16px",
                    background: "#ef4444",
                    border: "none",
                    borderRadius: "8px",
                    color: "white",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#dc2626")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#ef4444")}
                >
                  🗑️ Rimuovi
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ============================
            RIEPILOGO ORDINE
        ============================ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Titolo */}
          <h3 style={{ color: "#ff4dab", fontSize: "1.5rem", marginBottom: "10px" }}>
            Riepilogo ordine
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* Subtotale */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Subtotale:</span>
              <strong>€{subtotal.toFixed(2)}</strong>
            </div>

            {/* Spedizione */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#666" }}>Spedizione:</span>
              <strong style={{ color: shippingCost === 0 ? "#10b981" : "#2d2d2d" }}>
                {shippingCost === 0 ? "GRATIS ✓" : `€${shippingCost.toFixed(2)}`}
              </strong>
            </div>

            {/* Avviso spedizione gratuita */}
            {subtotal < 50 && (
              <div
                style={{
                  background: "rgba(255, 215, 0, 0.1)",
                  border: "1px solid #ffd700",
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "0.85rem",
                  color: "#8b6914",
                  textAlign: "center",
                  marginTop: "5px",
                }}
              >
                Aggiungi €{(50 - subtotal).toFixed(2)} per spedizione gratuita! 🚚
              </div>
            )}

            {/* Divider + totale */}
            <div
              style={{
                borderTop: "2px solid rgba(255, 121, 198, 0.2)",
                paddingTop: "15px",
                marginTop: "10px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.3rem", fontWeight: "700" }}>Totale:</span>
                <strong style={{ fontSize: "2rem", color: "#ff4dab" }}>
                  €{total.toFixed(2)}
                </strong>
              </div>
            </div>
          </div>

          {/* Pulsante checkout */}
          <button
            onClick={handleCheckout}
            style={{
              padding: "18px",
              background: "linear-gradient(90deg, #ff4dab, #ff79c6)",
              border: "none",
              borderRadius: "15px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1.1rem",
              boxShadow: "0 6px 20px rgba(255, 77, 171, 0.4)",
              transition: "all 0.3s",
              marginTop: "10px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 77, 171, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 77, 171, 0.4)";
            }}
          >
            🛒 Procedi al checkout
          </button>

          {/* Pulsante svuota carrello */}
          <button
            onClick={() => {
              if (window.confirm("Vuoi davvero svuotare il carrello?")) {
                clearCart();
              }
            }}
            style={{
              padding: "12px",
              background: "transparent",
              border: "2px solid #ef4444",
              borderRadius: "12px",
              color: "#ef4444",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ef4444";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#ef4444";
            }}
          >
            Svuota carrello
          </button>
        </div>
      </div>

      {/* Animazione CSS per il luccichio delle stelle */}
      <style>{`
        @keyframes twinkle {
          0%,100% {opacity: 0; transform: scale(0.5);}
          50% {opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}
