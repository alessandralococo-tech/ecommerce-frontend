import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, updateUser, updatePassword, logout } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validatePersonalData = () => {
    const newErrors = {};
    if (!formData.first_name || formData.first_name.trim().length < 2) newErrors.first_name = "Nome non valido";
    if (!formData.last_name || formData.last_name.trim().length < 2) newErrors.last_name = "Cognome non valido";
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email non valida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (formData.new_password && formData.new_password.length < 6) newErrors.new_password = "La password deve essere almeno di 6 caratteri";
    if (formData.new_password !== formData.confirm_password) newErrors.confirm_password = "Le password non corrispondono";
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePersonalData = async () => {
    if (!validatePersonalData()) return;
    setLoading(true);
    try {
      await updateUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone
      });
      alert("✅ Dati personali aggiornati!");
    } catch (err) {
      alert("Errore aggiornamento: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    if (!formData.current_password) {
      alert("Inserisci la password corrente");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(formData.current_password, formData.new_password);
      alert("✅ Password aggiornata!");
      setFormData(prev => ({ ...prev, current_password: "", new_password: "", confirm_password: "" }));
    } catch (err) {
      alert("Errore aggiornamento password: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "2px solid rgba(255, 121, 198, 0.3)",
    borderRadius: "10px",
    fontSize: "1rem",
    outline: "none"
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "80px 20px", position: "relative" }}>
      <div
        ref={cardRef}
        style={{
          position: "relative",
          background: "linear-gradient(145deg, #fff0f7, #ffe6f0)",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(255, 77, 171, 0.2)",
          border: "2px solid rgba(255, 121, 198, 0.2)",
          overflow: "hidden",
          display: "flex",
          gap: "40px",
          flexWrap: "wrap"
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
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
              opacity: 0,
              animation: `twinkle 2s ${star.delay}s infinite`,
            }}
          />
        ))}

        {/* Colonna dati personali */}
        <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <h2 style={{ color: "#ff4dab", fontSize: "1.5rem" }}>⭐ Dati personali</h2>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Nome" style={inputStyle} />
          {errors.first_name && <p style={{ color: "#ef4444", fontSize: "0.85rem" }}>{errors.first_name}</p>}
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Cognome" style={inputStyle} />
          {errors.last_name && <p style={{ color: "#ef4444", fontSize: "0.85rem" }}>{errors.last_name}</p>}
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" style={inputStyle} />
          {errors.email && <p style={{ color: "#ef4444", fontSize: "0.85rem" }}>{errors.email}</p>}
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefono" style={inputStyle} />
          <button
            onClick={handleSavePersonalData}
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
              transition: "all 0.3s",
              marginTop: "10px"
            }}
          >
            💾 Salva dati
          </button>
        </div>

        {/* Colonna cambio password */}
        <div style={{ flex: 1, minWidth: "280px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <h2 style={{ color: "#ff4dab", fontSize: "1.5rem" }}>🔒 Cambia password</h2>
          <input type="password" name="current_password" value={formData.current_password} onChange={handleChange} placeholder="Password corrente" style={inputStyle} />
          <input type="password" name="new_password" value={formData.new_password} onChange={handleChange} placeholder="Nuova password" style={inputStyle} />
          {errors.new_password && <p style={{ color: "#ef4444", fontSize: "0.85rem" }}>{errors.new_password}</p>}
          <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="Conferma nuova password" style={inputStyle} />
          {errors.confirm_password && <p style={{ color: "#ef4444", fontSize: "0.85rem" }}>{errors.confirm_password}</p>}
          <button
            onClick={handleChangePassword}
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
              transition: "all 0.3s",
              marginTop: "10px"
            }}
          >
            🔄 Cambia password
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "15px",
              background: "rgba(239,68,68,0.1)",
              color: "#ef4444",
              border: "2px solid #ef4444",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "10px",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#ef4444"; }}
          >
            🔓 Logout
          </button>
        </div>
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
