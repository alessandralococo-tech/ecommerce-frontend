import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../api/products";
import { useAuth } from "../contexts/AuthContext";

export default function CreateProductAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: "", 
    description: "", 
    price: "", 
    category_id: "",
    available_quantity: "",
    sku: "",
    active: true
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ 
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
        setError("Solo gli admin possono creare prodotti");
        setLoading(false);
        return;
      }

      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        category_id: parseInt(form.category_id, 10),
        available_quantity: parseInt(form.available_quantity, 10) || 0,
        sku: form.sku.trim() || null,
        active: form.active
      };

      if (!productData.name) {
        setError("Il nome del prodotto è obbligatorio");
        setLoading(false);
        return;
      }

      if (isNaN(productData.price) || productData.price <= 0) {
        setError("Inserisci un prezzo valido");
        setLoading(false);
        return;
      }

      if (isNaN(productData.category_id)) {
        setError("Inserisci un ID categoria valido");
        setLoading(false);
        return;
      }

      const newProduct = await createProduct(productData, user.token);
      
      if (newProduct) {
        navigate("/shop");
      }
    } catch (error) {
      setError(error.message || "Errore durante la creazione del prodotto");
      if (error.message.includes("Non autorizzato") || error.message.includes("401")) {
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
      <div style={{
        padding: "20px", 
        color: "#ff4dab", 
        textAlign: "center",
      }}>
        <h2>Accesso Negato</h2>
        <p>Solo gli amministratori possono creare prodotti.</p>
        <button 
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff4dab",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginTop: "10px",
            fontWeight: "bold"
          }}
        >
          Torna alla Home
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: "20px 40px", 
      maxWidth: "600px", 
      margin: "0 auto", 
      fontFamily: "Arial, sans-serif"
    }}>
      <h2 style={{ 
        textAlign: "center", 
        color: "#ff4dab", 
        fontSize: "1.8rem", 
        marginBottom: "25px" 
      }}>
        ✨ Crea Nuovo Prodotto ✨
      </h2>
      
      {error && (
        <div style={{ 
          padding: "10px", 
          backgroundColor: "#ffe6f0", 
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
        {["name", "description", "price", "available_quantity", "sku", "category_id"].map((field) => (
          <div key={field}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#333" }}>
              {field === "name" ? "Nome Prodotto *" :
               field === "description" ? "Descrizione" :
               field === "price" ? "Prezzo (€) *" :
               field === "available_quantity" ? "Quantità Disponibile" :
               field === "sku" ? "Codice SKU" :
               "ID Categoria *"}
            </label>
            {field === "description" ? (
              <textarea 
                name={field}
                placeholder="Descrizione del prodotto"
                value={form[field]}
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
                name={field} 
                type={field.includes("price") || field.includes("quantity") || field.includes("category") ? "number" : "text"}
                step={field === "price" ? "0.01" : undefined}
                min={field === "price" || field.includes("quantity") || field.includes("category") ? "0" : undefined}
                placeholder={field === "name" ? "Es: Maglietta Rosa" : field === "sku" ? "SKU-001 (opzionale)" : ""}
                value={form[field]}
                onChange={handleChange}
                required={field === "name" || field === "price" || field === "category_id"}
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

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#333" }}>
            <input 
              name="active" 
              type="checkbox" 
              checked={form.active}
              onChange={handleChange} 
              style={{ width: "18px", height: "18px" }}
            />
            <span>Prodotto attivo</span>
          </label>
        </div>

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
            {loading ? "Creazione in corso..." : "Crea Prodotto"}
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
