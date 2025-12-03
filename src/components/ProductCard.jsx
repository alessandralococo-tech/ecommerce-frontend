import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function ProductCard({ product }) {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const { addItem } = useCart();

  const createStar = (x, y) => {
    if (!cardRef.current) return;
    
    const star = document.createElement("div");
    star.innerHTML = "⭐";
    star.style.position = "absolute";
    star.style.left = x + "px";
    star.style.top = y + "px";
    star.style.fontSize = Math.random() * 15 + 10 + "px";
    star.style.pointerEvents = "none";
    star.style.animation = "starFloat 1s ease-out forwards";
    star.style.zIndex = "100";
    
    cardRef.current.appendChild(star);
    
    setTimeout(() => {
      star.remove();
    }, 1000);
  };

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (Math.random() > 0.85) {
      createStar(x, y);
    }
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product, 1);
    
    // Feedback visivo
    const button = e.currentTarget;
    const originalText = button.textContent;
    button.textContent = "✓ Aggiunto!";
    button.style.background = "linear-gradient(90deg, #10b981, #059669)";
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = "linear-gradient(90deg, #ff4dab, #ff79c6)";
    }, 1500);
  };

  return (
    <>
      <style>
        {`
          @keyframes starFloat {
            0% {
              transform: translateY(0) scale(0);
              opacity: 1;
            }
            100% {
              transform: translateY(-50px) scale(1);
              opacity: 0;
            }
          }
        `}
      </style>
      <div
        ref={cardRef}
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        style={{
          borderRadius: "20px",
          background: "linear-gradient(145deg, #ffffff, #fff5f9)",
          display: "flex",
          flexDirection: "column",
          padding: "0",
          boxShadow: "0 8px 25px rgba(255, 77, 171, 0.15)",
          transition: "transform 0.3s, box-shadow 0.3s",
          border: "2px solid rgba(255, 121, 198, 0.1)",
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 12px 35px rgba(255, 77, 171, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(255, 77, 171, 0.15)";
        }}
      >
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            style={{
              width: "100%",
              height: "220px",
              objectFit: "cover",
              borderBottom: "3px solid rgba(255, 121, 198, 0.2)",
            }}
          />
        )}

        <div style={{ 
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}>
          <h3 style={{ 
            marginBottom: "10px", 
            fontSize: "1.3rem",
            color: "#2d2d2d",
            fontWeight: "600"
          }}>
            {product.name}
          </h3>

          <p
            style={{
              color: "#666",
              fontSize: "0.9rem",
              marginBottom: "15px",
              minHeight: "40px",
              lineHeight: "1.5",
            }}
          >
            {product.description ? product.description.slice(0, 80) + "..." : ""}
          </p>

          <p style={{ 
            fontWeight: "bold", 
            fontSize: "1.4rem", 
            marginBottom: "12px",
            color: "#ff4dab",
          }}>
            €{Number(product.price).toFixed(2)}
          </p>

          <p
            style={{
              fontSize: "0.85rem",
              color: product.available_quantity > 0 ? "#10b981" : "#ef4444",
              marginBottom: "15px",
              fontWeight: "500",
            }}
          >
            {product.available_quantity > 0
              ? `Disponibili: ${product.available_quantity}`
              : "Non disponibile"}
          </p>

          {product.featured && (
            <span
              style={{
                background: "linear-gradient(90deg, #ffd700, #ffed4e)",
                padding: "6px 12px",
                borderRadius: "12px",
                fontSize: "0.8rem",
                display: "inline-block",
                alignSelf: "flex-start",
                marginBottom: "15px",
                fontWeight: "bold",
                color: "#8b6914",
                boxShadow: "0 2px 8px rgba(255, 215, 0, 0.3)",
              }}
            >
              ⭐ In evidenza
            </span>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.available_quantity <= 0}
            style={{
              width: "100%",
              padding: "14px",
              background: product.available_quantity > 0
                ? "linear-gradient(90deg, #ff4dab, #ff79c6)"
                : "#ccc",
              color: "#fff",
              borderRadius: "12px",
              border: "none",
              cursor: product.available_quantity > 0 ? "pointer" : "not-allowed",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "all 0.3s",
              boxShadow: product.available_quantity > 0 
                ? "0 4px 15px rgba(255, 77, 171, 0.3)"
                : "none",
              marginTop: "auto",
            }}
            onMouseEnter={(e) => {
              if (product.available_quantity > 0) {
                e.currentTarget.style.background = "linear-gradient(90deg, #ff79c6, #ff4dab)";
                e.currentTarget.style.transform = "scale(1.02)";
              }
            }}
            onMouseLeave={(e) => {
              if (product.available_quantity > 0) {
                e.currentTarget.style.background = "linear-gradient(90deg, #ff4dab, #ff79c6)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {product.available_quantity > 0 
              ? "Aggiungi al carrello" 
              : "Non disponibile"}
          </button>
        </div>
      </div>
    </>
  );
}