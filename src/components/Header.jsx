import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  // Prendo dati del carrello
  const { cart } = useCart();
  // Prendo dati utente e funzione logout
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Stato per aprire/chiudere il menu profilo
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Calcolo il numero totale di articoli nel carrello
  const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);
  // Verifico se l'utente è admin
  const isAdmin = user?.role === "admin";

  // Funzione per fare logout e tornare alla pagina login
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Stile comune per tutti i link della navbar
  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "1.05rem",
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    cursor: "pointer",
    transition: "transform 0.2s"
  };

  return (
    // ==================== HEADER ====================
    <header
      style={{
        width: "100%",
        background: "linear-gradient(90deg, #ff4dab, #ff79c6)", // sfumatura rosa
        color: "#fff",
        boxShadow: "0 4px 20px rgba(255, 77, 171, 0.4)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        padding: "15px 0",
      }}
    >
      {/* Container centrale */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <h1
          className="logo-text"
          style={{
            margin: 0,
            fontSize: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
            cursor: "pointer"
          }}
          onClick={() => navigate("/shop")} // Clic sul logo porta allo shop
        >
          ⭐ StarShop ⭐
        </h1>

        {/* ==================== NAVBAR ==================== */}
        <nav
          style={{
            display: "flex",
            gap: "25px",
            alignItems: "center",
          }}
        >
          {/* Link Shop */}
          <a 
            href="/shop" 
            style={linkStyle}
            onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"} // Effetto hover
            onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
          >
            🛍️ Shop
          </a>

          {/* Link Carrello */}
          <a 
            href="/cart" 
            style={linkStyle}
            onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
          >
            🛒 Carrello
            {cartCount > 0 && (
              <span
                style={{
                  background: "#ffd700",
                  color: "#2d2d2d",
                  borderRadius: "50%",
                  width: "22px",
                  height: "22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  marginLeft: "5px",
                }}
              >
                {cartCount} {/* Mostro numero articoli */}
              </span>
            )}
          </a>

          {/* Link dinamico: I miei ordini / Login */}
          {user ? (
            isAdmin ? null : ( // Se admin, non mostro link "I miei ordini"
              <a 
                href="/my-orders" 
                style={linkStyle}
                onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
              >
                📦 I miei ordini
              </a>
            )
          ) : (
            <a 
              href="/login" 
              style={linkStyle}
              onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
              onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
            >
              🔑 Login
            </a>
          )}

          {/* ==================== MENU PROFILO ==================== */}
          {user && (
            <div style={{ position: "relative" }}>
              {/* Bottone icona profilo */}
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)} // Toggle menu
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  overflow: "hidden",
                  transition: "transform 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"} // Hover effetto
                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {/* Icona SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  width="28px"
                  height="28px"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </button>
              
              {/* Menu dropdown */}
              {profileMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "50px",
                    right: 0,
                    background: "#fff",
                    color: "#2d2d2d",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    minWidth: "200px",
                    overflow: "hidden",
                    zIndex: 100,
                  }}
                >
                  {/* Informazioni utente */}
                  <div style={{
                    padding: "15px 20px",
                    borderBottom: "1px solid #eee",
                    background: "#f9f9f9"
                  }}>
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                      {user.first_name} {user.last_name}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>
                      {user.email}
                    </div>
                    {isAdmin && (
                      <div style={{
                        marginTop: "8px",
                        padding: "4px 8px",
                        background: "#ffd700",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        display: "inline-block"
                      }}>
                        👑 Admin
                      </div>
                    )}
                  </div>

                  {/* Pulsante Profilo */}
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setProfileMenuOpen(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "500",
                      transition: "background 0.2s"
                    }}
                    onMouseOver={(e) => e.target.style.background = "#f5f5f5"}
                    onMouseOut={(e) => e.target.style.background = "transparent"}
                  >
                    👤 Profilo
                  </button>

                  {/* Dashboard admin (solo admin) */}
                  {isAdmin && (
                    <button
                      onClick={() => {
                        navigate("/admin/dashboard");
                        setProfileMenuOpen(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "12px 20px",
                        textAlign: "left",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "500",
                        transition: "background 0.2s"
                      }}
                      onMouseOver={(e) => e.target.style.background = "#f5f5f5"}
                      onMouseOut={(e) => e.target.style.background = "transparent"}
                    >
                      🎯 Dashboard Admin
                    </button>
                  )}

                  {/* Logout */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setProfileMenuOpen(false);
                    }}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "500",
                      color: "#ef4444",
                      borderTop: "1px solid #eee",
                      transition: "background 0.2s"
                    }}
                    onMouseOver={(e) => e.target.style.background = "#fee"}
                    onMouseOut={(e) => e.target.style.background = "transparent"}
                  >
                    🔓 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
