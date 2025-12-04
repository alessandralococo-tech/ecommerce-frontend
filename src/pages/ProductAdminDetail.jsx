import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateProduct } from "../api/products";
import { useAuth } from "../contexts/AuthContext";

export default function ProductAdminDetail() {
  const { user, logout } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Errore nel caricamento del prodotto");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (user?.role !== "admin") {
        setError("Solo gli admin possono modificare prodotti");
        return;
      }

      const updated = await updateProduct(id, product, user.token);
      if (updated) {
        navigate("/shop");
      }
    } catch (error) {
      setError(error.message);
      if (error.message.includes("Non autorizzato")) {
        setTimeout(() => {
          logout();
          navigate("/login");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div style={{ padding: "20px", color: "#ff4dab", textAlign: "center" }}>
        <h2>Accesso Negato</h2>
        <p>Solo gli amministratori possono modificare prodotti.</p>
      </div>
    );
  }

  if (!product) return <div style={{ padding: "20px", textAlign: "center" }}>Caricamento...</div>;

  return (
    <div style={{ padding: "20px 40px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#ff4dab", fontSize: "1.8rem", marginBottom: "25px" }}>
        ✨ Modifica Prodotto ✨
      </h2>

      {error && (
        <div style={{ 
          padding: "10px",
          backgroundColor: "#fff0f6",
          color: "#ff4dab",
          borderRadius: "8px",
          marginBottom: "15px",
          border: "1px solid #ff4dab",
          textAlign: "center"
        }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {[
          { name: "name", label: "Nome Prodotto *", type: "text" },
          { name: "description", label: "Descrizione", type: "textarea" },
          { name: "price", label: "Prezzo (€) *", type: "number", step: "0.01" },
          { name: "available_quantity", label: "Quantità Disponibile", type: "number" },
          { name: "sku", label: "Codice SKU", type: "text" },
          { name: "category_id", label: "ID Categoria *", type: "number" }
        ].map((field) => (
          <div key={field.name}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={product[field.name] || ""}
                onChange={handleChange}
                rows="4"
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "20px",
                  border: "1px solid #ff4dab",
                  backgroundColor: "#fff0f6"
                }}
              />
            ) : (
              <input
                name={field.name}
                type={field.type}
                step={field.step || undefined}
                value={product[field.name] || (field.type === "number" ? 0 : "")}
                onChange={handleChange}
                required={field.label.includes("*")}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "20px",
                  border: "1px solid #ff4dab",
                  backgroundColor: "#fff0f6"
                }}
              />
            )}
          </div>
        ))}

        <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#333" }}>
          <input
            name="active"
            type="checkbox"
            checked={product.active || false}
            onChange={handleChange}
            style={{ width: "18px", height: "18px" }}
          />
          Prodotto attivo
        </label>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px",
              backgroundColor: "#ff4dab",
              color: "#fff",
              border: "none",
              borderRadius: "20px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#ff79c6"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#ff4dab"}
          >
            {loading ? "Aggiornamento in corso..." : "Aggiorna Prodotto"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/shop")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ffe6f0",
              color: "#ff4dab",
              border: "1px solid #ff4dab",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#ffcee6"}
            onMouseLeave={(e) => e.currentTarget.style.background = "#ffe6f0"}
          >
            Annulla
          </button>
        </div>
      </form>
    </div>
  );
}
