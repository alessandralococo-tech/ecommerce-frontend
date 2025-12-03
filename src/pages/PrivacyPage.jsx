import React, { useEffect, useState, useRef } from "react";

export default function PrivacyPage() {
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
        🔒 Privacy
      </h1>
      <p style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto", fontSize: "1rem", color: "#2d2d2d" }}>
        La tua privacy è la nostra priorità. Tutti i dati vengono gestiti in modo sicuro e non saranno mai condivisi senza il tuo consenso.
      </p>

      <ul style={{ maxWidth: "600px", margin: "40px auto", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "15px" }}>
        <li>⭐ Dati crittografati e protetti</li>
        <li>⭐ Nessuna condivisione con terzi</li>
        <li>⭐ Accesso sicuro tramite login</li>
        <li>⭐ Supporto privacy sempre disponibile</li>
      </ul>

      <style>{`
        @keyframes twinkle {
          0%,100% {opacity: 0; transform: scale(0.5);}
          50% {opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}
