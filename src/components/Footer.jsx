import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'; 
import { Link } from "react-router-dom"; // <-- Import Link

export default function Footer() {
  
  const socialIconStyle = {
    color: "#fff", 
    fontSize: "1.5rem",
    transition: "transform 0.3s ease-in-out, filter 0.3s ease-in-out",
    display: "inline-block",
    filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.4))", 
  };
  
  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = "scale(1.2) rotate(3deg)";
    e.currentTarget.style.filter = "drop-shadow(0 0 8px #fff)"; 
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.filter = "drop-shadow(0 0 2px rgba(255, 255, 255, 0.4))";
  };
    
  return (
    <footer
      style={{
        width: "100%",
        background: "linear-gradient(135deg, #ff85c1 0%, #ff4dab 100%)",
        color: "#fff",
        boxShadow: "0 -4px 25px rgba(255, 77, 171, 0.5)",
        padding: "40px 0", 
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 20px",
          textAlign: "center",
        }}
      >
        <h2 
          className="logo-text"
          style={{ 
            marginBottom: "20px", 
            fontSize: "1.6rem", 
            textShadow: "0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 100, 200, 0.5)",
          }}
        >
          ⭐ StarShop ⭐
        </h2>
        
        {/* Link pagine */}
        <div style={{ display: "flex", justifyContent: "center", gap: "25px", marginBottom: "25px" }}>
            <Link to="/information" style={{ color: "#fce9fc", textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}>Informazioni</Link>
            <Link to="/contacts" style={{ color: "#fce9fc", textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}>Contatti</Link>
            <Link to="/terms" style={{ color: "#fce9fc", textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}>Termini</Link>
            <Link to="/privacy" style={{ color: "#fce9fc", textDecoration: "none", fontSize: "0.95rem", fontWeight: "500" }}>Privacy</Link>
        </div>
        
        {/* Icone social */}
        <div style={{ display: "flex", justifyContent: "center", gap: "25px", marginBottom: "20px" }}>
          <a 
            href="https://facebook.com" 
            style={socialIconStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="Seguici su Facebook"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a 
            href="https://instagram.com" 
            style={socialIconStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="Seguici su Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a 
            href="https://twitter.com" 
            style={socialIconStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="Seguici su Twitter (X)"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
        </div>
        
        <p style={{ fontSize: "0.85rem", color: "rgba(255, 255, 255, 0.8)", fontWeight: "300" }}>
          © 2025 Lipari Consulting
        </p>
      </div>
    </footer>
  );
}
