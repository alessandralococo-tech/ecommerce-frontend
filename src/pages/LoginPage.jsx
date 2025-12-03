import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef(null);
  const [stars, setStars] = useState([]);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Redirect se già loggato
  useEffect(() => {
    if (isAuthenticated()) {
      const from = location.state?.from || "/shop";
      navigate(from);
    }
  }, [isAuthenticated, navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      const from = location.state?.from || "/shop";
      navigate(from);
    } catch (err) {
      setError(err.message || "Errore durante il login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "60px 20px", position: "relative" }}>
      <div
        ref={cardRef}
        style={{
          position: "relative",
          background: "linear-gradient(145deg, #ffffff, #fff5f9)",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(255, 77, 171, 0.2)",
          border: "2px solid rgba(255, 121, 198, 0.2)",
          overflow: "hidden"
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

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2.5rem", color: "#ff4dab", marginBottom: "10px", fontWeight: "700" }}>
            ⭐ Accedi a StarShop
          </h1>
          <p style={{ color: "#666", fontSize: "1rem" }}>
            Accedi per continuare con il tuo ordine
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "2px solid #ef4444",
            borderRadius: "10px",
            padding: "12px",
            marginBottom: "20px",
            color: "#ef4444",
            textAlign: "center",
            fontWeight: "600"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Email */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d2d2d" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@esempio.com"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid rgba(255, 121, 198, 0.3)",
                borderRadius: "10px",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.3s",
                color: "#2d2d2d",
              }}
              onFocus={(e) => e.target.style.borderColor = "#ff4dab"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 121, 198, 0.3)"}
            />
            <style>{`input::placeholder { color: #aaa; }`}</style>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#2d2d2d" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid rgba(255, 121, 198, 0.3)",
                borderRadius: "10px",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.3s",
                color: "#2d2d2d",
              }}
              onFocus={(e) => e.target.style.borderColor = "#ff4dab"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255, 121, 198, 0.3)"}
            />
            <style>{`input::placeholder { color: #aaa; }`}</style>
          </div>

          {/* Bottone Login */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "15px",
              background: loading ? "#ccc" : "linear-gradient(90deg, #ff4dab, #ff79c6)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 15px rgba(255, 77, 171, 0.4)",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255, 77, 171, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 77, 171, 0.4)";
              }
            }}
          >
            {loading ? "Accesso in corso..." : "🔐 Accedi"}
          </button>
        </form>

        {/* Link Registrazione */}
        <div style={{ marginTop: "25px", textAlign: "center" }}>
          <p style={{ color: "#666", marginBottom: "10px" }}>
            Non hai un account?
          </p>
          <button
            onClick={() => navigate("/register", { state: location.state })}
            style={{
              background: "transparent",
              border: "2px solid #ff4dab",
              color: "#ff4dab",
              padding: "10px 30px",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ff4dab";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#ff4dab";
            }}
          >
            Registrati
          </button>
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
