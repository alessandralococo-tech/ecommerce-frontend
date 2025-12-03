import React, { useEffect, useState, useRef } from "react";

export default function InformationPage() {
  const cardRef = useRef(null);
  const [stars, setStars] = useState([]);

  // Stelle animate sullo sfondo
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

  const services = [
    {
      title: "🚀 Spedizione Veloce",
      desc: "Ordina oggi, ricevi domani! Consegna rapida e sicura direttamente a casa tua.",
    },
    {
      title: "💖 Prodotti Esclusivi",
      desc: "Accesso a prodotti unici e collezioni limitate che non troverai altrove.",
    },
    {
      title: "🛡️ Pagamenti Sicuri",
      desc: "Tranquillità totale: tutte le transazioni sono crittografate e protette.",
    },
  ];

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
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            opacity: 0,
            animation: `twinkle 2s ${star.delay}s infinite`,
          }}
        />
      ))}

      <h1 style={{ textAlign: "center", fontSize: "2.8rem", color: "#ff4dab", marginBottom: "30px", fontWeight: "700" }}>
        ⭐ I nostri Servizi ⭐
      </h1>
      <p style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 50px", fontSize: "1.1rem", color: "#2d2d2d" }}>
        StarShop ti offre un’esperienza unica e magica! Scopri i nostri servizi pensati per rendere ogni acquisto speciale.
      </p>

      {/* Cards servizi */}
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "30px" }}>
        {services.map((s, idx) => (
          <div
            key={idx}
            style={{
              background: "linear-gradient(145deg, #fff0f7, #ffe6f0)",
              padding: "30px",
              borderRadius: "20px",
              boxShadow: "0 10px 30px rgba(255,77,171,0.2)",
              width: "250px",
              textAlign: "center",
              transition: "transform 0.3s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px) scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0) scale(1)"}
          >
            <h2 style={{ color: "#ff4dab", fontSize: "1.3rem", marginBottom: "10px" }}>{s.title}</h2>
            <p style={{ color: "#2d2d2d", fontSize: "1rem" }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Animazioni stelle */}
      <style>{`
        @keyframes twinkle {
          0%,100% {opacity: 0; transform: scale(0.5);}
          50% {opacity: 1; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}
