import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "1.05rem",
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
  };

  return (
    <header
      style={{
        width: "100%",
        background: "linear-gradient(90deg, #ff4dab, #ff79c6)",
        color: "#fff",
        boxShadow: "0 4px 20px rgba(255, 77, 171, 0.4)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        padding: "15px 0",
      }}
    >
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
        <h1
          className="logo-text"
          style={{
            margin: 0,
            fontSize: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          ⭐ StarShop ⭐
        </h1>
        <nav
          style={{
            display: "flex",
            gap: "25px",
            alignItems: "center",
          }}
        >
          {/* Link Shop */}
          <a href="/shop" style={linkStyle}>
            🛍️ Shop
          </a>

          {/* Link Carrello */}
          <a href="/cart" style={linkStyle}>
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
                {cartCount}
              </span>
            )}
          </a>

          {/* Link Checkout */}
          <a href="/checkout" style={linkStyle}>
            ✨ Checkout
          </a>

          {/* Icona profilo */}
          {user && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
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
                }}
              >
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
                    minWidth: "160px",
                    overflow: "hidden",
                    zIndex: 100,
                  }}
                >
                  <button
                    onClick={() => navigate("/profile")}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Profilo
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      padding: "12px 20px",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "500",
                      color: "#ef4444",
                    }}
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
