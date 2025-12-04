import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const tempStars = Array.from({ length: 30 }).map(() => ({
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      size: Math.random() * 3 + 2 + "px",
      delay: Math.random() * 3 + "s",
    }));
    setStars(tempStars);
  }, []);

  const landingStyle = {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(135deg, #ffb6c1, #ff69b4)",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
  };

  const overlayStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.2)",
    zIndex: 1,
  };

  const contentStyle = {
    textAlign: "center",
    padding: "20px",
    zIndex: 2,
  };

  const titleStyle = {
    fontSize: "4rem",
    marginBottom: "20px",
    textShadow: "2px 2px 10px rgba(255,255,255,0.6)",
  };

  const subtitleStyle = {
    fontSize: "1.5rem",
    marginBottom: "40px",
    textShadow: "1px 1px 8px rgba(255,255,255,0.5)",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  };

  const buttonStyle = {
    padding: "15px 35px",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#fff",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: "0 6px 20px rgba(255, 77, 171, 0.7), 0 0 15px rgba(255, 105, 180, 0.5)",
    textShadow: "1px 1px 5px rgba(0,0,0,0.3)",
    border: "none", // Rimosso bordo
  };

  const buttonHoverStyle = {
    transform: "translateY(-3px) scale(1.05)",
    boxShadow: "0 10px 30px rgba(255, 77, 171, 0.9), 0 0 20px rgba(255, 105, 180, 0.7)",
  };

  return (
    <div style={landingStyle}>
      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={overlayStyle}></div>

      {stars.map((star, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            backgroundColor: "#fff",
            borderRadius: "50%",
            opacity: 0,
            animation: `twinkle 2s ${star.delay} infinite`,
            zIndex: 2,
          }}
        ></div>
      ))}

      <div style={contentStyle}>
        <h1 style={titleStyle}>✨ Benvenuto su StarShop! ✨</h1>
        <p style={subtitleStyle}>Scopri prodotti stellari!</p>

        <div style={buttonContainerStyle}>
          {/* Bottone Shop */}
          <button
            style={{
              ...buttonStyle,
              background: "linear-gradient(90deg, #ff6bbf, #ff1a75)",
            }}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, buttonHoverStyle)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, buttonStyle)
            }
            onClick={() => navigate("/shop")}
          >
            Entra nello Shop
          </button>

          {/* Bottone Login */}
          <button
            style={{
              ...buttonStyle,
              background: "linear-gradient(90deg, #ff8ac4, #ff3380)",
            }}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, buttonHoverStyle)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, buttonStyle)
            }
            onClick={() => navigate("/login")}
          >
            Accedi
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes twinkle {
            0%,100% {opacity: 0; transform: scale(0.5);}
            50% {opacity: 1; transform: scale(1);}
          }
        `}
      </style>
    </div>
  );
}
