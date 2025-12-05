import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts, deleteProduct } from "../api/products";
import { getCategories } from "../api/categories";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stato per le stelle magiche
  const [magicStars, setMagicStars] = useState([]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(p => {
        // Controllo sia category_id che category?.id per sicurezza
        return p.category_id === selectedCategory || p.category?.id === selectedCategory;
      })
    : products;

  const handleDeleteProduct = async (productId) => {
    try {
      // Prendo il token da localStorage
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        alert("Devi effettuare il login come admin!");
        return;
      }

      // Chiamo l'API per eliminare il prodotto
      await deleteProduct(productId, token);
      
      // Aggiorno lo stato locale rimuovendo il prodotto eliminato
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      
      alert("✅ Prodotto eliminato con successo!");
    } catch (error) {
      console.error("Errore eliminazione prodotto:", error);
      alert("❌ Errore: " + error.message);
    }
  };

  const triggerMagic = (id) => {
    const newStars = Array.from({ length: 12 }).map(() => ({
      id: Date.now() + Math.random(),
      categoryId: id,
      left: Math.random() * 100,
      top: Math.random() * 20,
      size: 8 + Math.random() * 12,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`
    }));
    setMagicStars((prev) => [...prev, ...newStars]);
    setTimeout(() => {
      setMagicStars((prev) => prev.filter((s) => !newStars.includes(s)));
    }, 1200);
  };

  const handleCategoryClick = (id) => {
    setSelectedCategory(id);
    triggerMagic(id);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", fontSize: "1.2rem", color: "#ff4dab" }}>
        ⭐ Caricamento prodotti...
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 40px", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ color: "#ff4dab", fontSize: "2rem" }}>
          ⭐ Benvenuto nel nostro negozio ⭐
        </h1>
        <p style={{ color: "#555", fontSize: "1rem" }}>
          Sfoglia i prodotti e filtra per categoria!
        </p>
      </div>

      {/* Filtro categorie */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", marginBottom: "30px", position: "relative" }}>
        <button
          onClick={() => { setSelectedCategory(null); triggerMagic(null); }}
          style={{
            margin: "5px",
            padding: "8px 18px",
            borderRadius: "20px",
            border: selectedCategory === null ? "2px solid #ff4dab" : "1px solid #ccc",
            backgroundColor: selectedCategory === null ? "#ffe6f0" : "#fff",
            cursor: "pointer",
            transition: "all 0.3s",
            position: "relative",
            overflow: "visible"
          }}
        >
          Tutte
        </button>
        {categories.map(c => (
          <div key={c.id} style={{ position: "relative" }}>
            <button
              onClick={() => handleCategoryClick(c.id)}
              style={{
                margin: "5px",
                padding: "8px 18px",
                borderRadius: "20px",
                border: selectedCategory === c.id ? "2px solid #ff4dab" : "1px solid #ccc",
                backgroundColor: selectedCategory === c.id ? "#ffe6f0" : "#fff",
                cursor: "pointer",
                transition: "all 0.3s",
                position: "relative",
                overflow: "visible"
              }}
            >
              {c.name}
            </button>

            {/* Stelle magiche */}
            {magicStars.filter(s => s.categoryId === c.id).map(s => (
              <span
                key={s.id}
                style={{
                  position: "absolute",
                  top: `${-10 - s.top}px`,
                  left: `${s.left}%`,
                  fontSize: `${s.size}px`,
                  color: s.color,
                  animation: "magicJump 1.2s ease-out forwards",
                  pointerEvents: "none",
                }}
              >
                ⭐
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Griglia prodotti */}
      <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: "20px" }}>
        {filteredProducts.map((p) => (
          <ProductCard 
            key={p.id} 
            product={p} 
            onDelete={handleDeleteProduct} // ✅ Passo la funzione corretta
          />
        ))}
      </div>

      {/* Pulsante Crea prodotto (solo admin) */}
      {isAdmin && (
        <div style={{ marginTop: "50px", textAlign: "center" }}>
          <button
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              background: "#ff4dab",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "all 0.3s"
            }}
            onClick={() => navigate("/admin/create-product")}
            onMouseEnter={(e) => e.currentTarget.style.background = "#ff79c6"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#ff4dab"}
          >
            ➕ Crea nuovo prodotto
          </button>
        </div>
      )}

      {/* Animazioni */}
      <style>
        {`
          @keyframes magicJump {
            0% { transform: translateY(0) scale(0.5); opacity: 1; }
            30% { transform: translateY(-20px) scale(1); opacity: 1; }
            60% { transform: translateY(-40px) scale(1.2); opacity: 0.8; }
            100% { transform: translateY(-60px) scale(0.8); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}