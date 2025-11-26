import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../API/products";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const cardRef = useRef(null);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const [stars, setStars] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProductById(id);
      setProduct(data);
      setLoading(false);
    }
    loadProducts();
  }, [id]);

  // Misuriamo la card per posizionare le stelle
  useEffect(() => {
    if (cardRef.current) {
      const { offsetWidth, offsetHeight } = cardRef.current;
      setCardSize({ width: offsetWidth, height: offsetHeight });

      const tempStars = Array.from({ length: 20 }).map(() => ({
        left: Math.random() * offsetWidth,
        top: Math.random() * offsetHeight,
        size: Math.random() * 10 + 5,
        delay: Math.random() * 2,
      }));
      setStars(tempStars);
    }
  }, [product]);

  const handleAddToCart = () => {
    console.log(`Aggiunto ${quantity}x ${product.name} al carrello!`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", fontSize: "1.2rem", color: "#ff4dab" }}>
        ⭐ Caricamento prodotto...
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2 style={{ color: "#ff4dab", marginBottom: "20px" }}> 😢 Prodotto non trovato </h2>
        <button
          onClick={() => navigate("/")}
          style={{ padding: "12px 30px", background: "linear-gradient(90deg, #ff4dab, #ff79c6)", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold" }}
        >
          Torna alla Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", position: "relative" }}>
      {/* Bottone Indietro */}
      <button
        onClick={() => navigate("/")}
        style={{ marginBottom: "30px", padding: "10px 20px", background: "rgba(255, 77, 171, 0.1)", border: "2px solid #ff4dab", borderRadius: "10px", color: "#ff4dab", cursor: "pointer", fontSize: "1rem", fontWeight: "600", transition: "all 0.3s" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#ff4dab"; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255, 77, 171, 0.1)"; e.currentTarget.style.color = "#ff4dab"; }}
      >
        ← Torna ai prodotti
      </button>

      {/* Container principale */}
      <div
        ref={cardRef}
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "50px",
          background: "linear-gradient(145deg, #ffffff, #fff5f9)",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(255, 77, 171, 0.2)",
          border: "2px solid rgba(255, 121, 198, 0.2)",
          overflow: "hidden",
        }}
      >
        {/* Stelle a forma di stella */}
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

        {/* Immagine Prodotto */}
        <div style={{ position: "relative" }}>
          {product.featured && (
            <span style={{ position: "absolute", top: "20px", left: "20px", background: "linear-gradient(90deg, #ffd700, #ffed4e)", padding: "8px 16px", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "bold", color: "#8b6914", boxShadow: "0 4px 12px rgba(255, 215, 0, 0.4)", zIndex: 10 }}>
              ⭐ In evidenza
            </span>
          )}
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "500px", objectFit: "cover", borderRadius: "15px", boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)" }} />
          ) : (
            <div style={{ width: "100%", height: "500px", background: "linear-gradient(135deg, #ffc2dc, #ffb3d9)", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>
              📦
            </div>
          )}
        </div>

        {/* Dettagli Prodotto */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1 style={{ fontSize: "2.5rem", color: "#2d2d2d", marginBottom: "10px", fontWeight: "700" }}>{product.name}</h1>
          {product.sku && <p style={{ color: "#999", fontSize: "0.9rem", marginTop: "-10px" }}>SKU: {product.sku}</p>}
          <div style={{ padding: "15px 0", borderTop: "2px solid rgba(255, 121, 198, 0.2)", borderBottom: "2px solid rgba(255, 121, 198, 0.2)" }}>
            <p style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#ff4dab" }}>€{Number(product.price).toFixed(2)}</p>
          </div>
          <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#555" }}>{product.description || "Nessuna descrizione disponibile."}</p>

          <div style={{ padding: "15px 20px", background: product.available_quantity > 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", borderRadius: "12px", border: product.available_quantity > 0 ? "2px solid rgba(16, 185, 129, 0.3)" : "2px solid rgba(239, 68, 68, 0.3)" }}>
            <p style={{ fontSize: "1rem", fontWeight: "600", color: product.available_quantity > 0 ? "#10b981" : "#ef4444" }}>
              {product.available_quantity > 0 ? `✓ Disponibili: ${product.available_quantity} pezzi` : "✗ Non disponibile"}
            </p>
          </div>

          {/* Selettore Quantità */}
          {product.available_quantity > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <label style={{ fontSize: "1.1rem", fontWeight: "600", color: "#2d2d2d" }}>Quantità:</label>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: "40px", height: "40px", background: "#ff4dab", color: "#fff", border: "none", borderRadius: "10px", fontSize: "1.5rem", cursor: "pointer", fontWeight: "bold", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#ff79c6"} onMouseLeave={(e) => e.currentTarget.style.background = "#ff4dab"}>-</button>
                <span style={{ fontSize: "1.3rem", fontWeight: "600", minWidth: "40px", textAlign: "center" }}>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.available_quantity, quantity + 1))} style={{ width: "40px", height: "40px", background: "#ff4dab", color: "#fff", border: "none", borderRadius: "10px", fontSize: "1.5rem", cursor: "pointer", fontWeight: "bold", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#ff79c6"} onMouseLeave={(e) => e.currentTarget.style.background = "#ff4dab"}>+</button>
              </div>
            </div>
          )}

          {/* Bottone Aggiungi al Carrello */}
          <button onClick={handleAddToCart} disabled={product.available_quantity <= 0} style={{ marginTop: "20px", padding: "18px", background: product.available_quantity > 0 ? "linear-gradient(90deg, #ff4dab, #ff79c6)" : "#ccc", color: "#fff", border: "none", borderRadius: "15px", fontSize: "1.2rem", fontWeight: "bold", cursor: product.available_quantity > 0 ? "pointer" : "not-allowed", transition: "all 0.3s", boxShadow: product.available_quantity > 0 ? "0 6px 20px rgba(255, 77, 171, 0.4)" : "none" }} onMouseEnter={(e) => { if(product.available_quantity > 0){ e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 77, 171, 0.5)"; }}} onMouseLeave={(e) => { if(product.available_quantity > 0){ e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 77, 171, 0.4)"; }}}>
            {product.available_quantity > 0 ? "🛒 Aggiungi al carrello" : "Non disponibile"}
          </button>

          {/* Info aggiuntive */}
          <div style={{ marginTop: "30px", padding: "20px", background: "rgba(255, 121, 198, 0.05)", borderRadius: "12px", fontSize: "0.9rem", color: "#666" }}>
            <p style={{ marginBottom: "8px" }}>✓ Spedizione gratuita per ordini superiori a €50</p>
            <p style={{ marginBottom: "8px" }}>✓ Reso gratuito entro 30 giorni</p>
            <p>✓ Garanzia 2 anni</p>
          </div>
        </div>
      </div>

      {/* Animazioni CSS */}
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0; transform: scale(0.5);}
            50% { opacity: 1; transform: scale(1);}
          }
        `}
      </style>
    </div>
  );
}
