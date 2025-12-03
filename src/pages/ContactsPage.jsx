import React, { useEffect, useState, useRef } from "react";

export default function ContactsPage() {
  const cardRef = useRef(null);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    if (cardRef.current) {
      const { offsetWidth, offsetHeight } = cardRef.current;
      const tempStars = Array.from({ length: 25 }).map(() => ({
        left: Math.random() * offsetWidth,
        top: Math.random() * offsetHeight,
        size: Math.random() * 10 + 5,
        delay: Math.random() * 2,
      }));
      setStars(tempStars);
    }
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        minHeight: "100vh",
        padding: "100px 20px",
        background: "linear-gradient(145deg, #ffe6f0, #fff0f7)",
        position: "relative",
        overflow: "hidden",
      }}
    >
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

      <h1 style={{ textAlign: "center", fontSize: "2.8rem", color: "#ff4dab", marginBottom: "30px", fontWeight: "700" }}>
        📬 Contattaci
      </h1>
      <p style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 50px", fontSize: "1.1rem", color: "#2d2d2d" }}>
        Hai domande o vuoi inviarci un messaggio? Siamo qui per aiutarti! Compila il form o scrivici direttamente via email.
      </p>

      <div style={{ maxWidth: "500px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
        <input type="text" placeholder="Nome" style={inputStyle} />
        <input type="email" placeholder="Email" style={inputStyle} />
        <textarea placeholder="Messaggio" rows="5" style={inputStyle}></textarea>
        <button style={buttonStyle}>💌 Invia Messaggio</button>
      </div>

      <style>{`
        @keyframes twinkle {
          0%,100% {opacity: 0; transform: scale(0.5);}
          50% {opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "2px solid rgba(255,121,198,0.3)",
  outline: "none",
  fontSize: "1rem",
  width: "100%",
};

const buttonStyle = {
  padding: "15px",
  borderRadius: "12px",
  background: "linear-gradient(90deg,#ff4dab,#ff79c6)",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1.1rem",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 15px rgba(255,77,171,0.4)",
  transition: "all 0.3s",
};
