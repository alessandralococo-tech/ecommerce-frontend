import React from "react";

export default function Header() {
    
  const handleMouseEnter = (e) => {
    e.currentTarget.style.textShadow = "0 0 10px rgba(255, 255, 255, 0.8)";
    e.currentTarget.style.transform = "scale(1.05)";
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.textShadow = "none";
    e.currentTarget.style.transform = "scale(1)";
  };
    
  return (
    <header
      style={{
        width: "100%",
        background: "linear-gradient(90deg, #ff4dab 0%, #ff85c1 100%)", 
        color: "#fff",
        boxShadow: "0 4px 25px rgba(255, 77, 171, 0.5)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        padding: "20px 0",
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
          className="logo-text twinkle-logo"
          style={{ 
            margin: 0, 
            fontSize: "2.2rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textShadow: "0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 100, 200, 0.5)",
          }}
        >
          ⭐ StarShop ⭐
        </h1>
        <nav>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              gap: "30px",
              margin: 0,
              padding: 0,
            }}
          >
            <li>
              <a 
                href="/" 
                style={{ color: "#fff", textDecoration: "none", fontWeight: "500", fontSize: "1.05rem", transition: "all 0.3s" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="/cart" 
                style={{ color: "#fff", textDecoration: "none", fontWeight: "500", fontSize: "1.05rem", transition: "all 0.3s" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                🛒 Carrello
              </a>
            </li>
            <li>
              <a 
                href="/checkout" 
                style={{ color: "#fff", textDecoration: "none", fontWeight: "500", fontSize: "1.05rem", transition: "all 0.3s" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                ✨ Checkout
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}