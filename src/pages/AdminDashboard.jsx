import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../api/users";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); 
  const isAdmin = user?.role === "admin"; // controllo se l'utente è admin
  
  // Stati
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ==================== CARICA UTENTI ALL'AVVIO ====================
  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    async function loadUsers() {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getUsers(user.token); // richiamo API per ottenere utenti
        setUsers(data); // salvo utenti nello stato
      } catch (err) {
        console.error("Errore caricamento utenti:", err);
        setError(err.message);

        // se token non valido o non autorizzato, faccio logout e redirect
        if (err.message.includes("Non autorizzato")) {
          setTimeout(() => {
            logout();
            navigate("/login");
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadUsers();
  }, [isAdmin, user?.token]);

  // ==================== ELIMINA UTENTE ====================
  const handleDelete = async (id) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo utente?")) return;
    
    setError(null);
    
    try {
      await deleteUser(id, user.token); // chiamata API per cancellare
      setUsers(prev => prev.filter(u => u.id !== id)); // rimuovo utente dallo stato
    } catch (err) {
      console.error("Errore eliminazione utente:", err);
      setError(err.message);

      if (err.message.includes("Non autorizzato")) { 
        setTimeout(() => {
          logout();
          navigate("/login");
        }, 2000);
      }
    }
  };

  // ==================== SE NON È ADMIN ====================
  if (!isAdmin) {
    return (
      <div style={{ padding: "40px", textAlign: "center", marginTop: "80px" }}>
        <h1 style={{ color: "#ff4dab" }}>⛔ Accesso Negato</h1>
        <p>Solo gli amministratori possono accedere a questa pagina.</p>
        <button
          onClick={() => navigate("/shop")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#ff4dab",
            color: "#fff",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.background = "#ff79c6"}
          onMouseLeave={(e) => e.target.style.background = "#ff4dab"}
        >
          Torna allo Shop
        </button>
      </div>
    );
  }

  // ==================== SE LOADING ====================
  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", marginTop: "80px" }}>
        <p style={{ fontSize: "1.2rem", color: "#ff4dab" }}>⏳ Caricamento utenti...</p>
      </div>
    );
  }

  // ==================== DASHBOARD ====================
  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "80px auto 0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{
          margin: 0,
          background: "linear-gradient(90deg, #ff4dab, #ff79c6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "2.5rem",
          fontWeight: "bold"
        }}>
          ⭐ Dashboard Admin
        </h1>
        <div style={{ fontSize: "0.9rem", color: "#666" }}>
          Totale utenti: <strong>{users.length}</strong>
        </div>
      </div>

      {/* Messaggio di errore */}
      {error && (
        <div style={{
          padding: "15px",
          backgroundColor: "#fff0f6",
          color: "#ff4dab",
          borderRadius: "12px",
          marginBottom: "20px",
          border: "1px solid #ff4dab",
          textAlign: "center",
          fontWeight: "500"
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Tabella utenti */}
      {users.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", background: "#fff0f6", borderRadius: "12px" }}>
          <p style={{ fontSize: "1.1rem", color: "#666" }}>Nessun utente trovato</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#ffe6f0" }}>
                {["ID", "Nome", "Email", "Ruolo", "Stato", "Azioni"].map((title) => (
                  <th key={title} style={{
                    padding: "15px",
                    textAlign: title === "Azioni" || title === "Stato" ? "center" : "left",
                    borderBottom: "2px solid #ff4dab",
                    fontWeight: "600",
                    color: "#333"
                  }}>{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.id} style={{ background: idx % 2 === 0 ? "#fff" : "#fff7fb" }}>
                  <td style={{ padding: "15px" }}>#{u.id}</td>
                  <td style={{ padding: "15px", fontWeight: "500" }}>{u.first_name} {u.last_name}</td>
                  <td style={{ padding: "15px", color: "#666" }}>{u.email}</td>
                  <td style={{ padding: "15px" }}>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      background: u.role === "admin" ? "#ffd700" : "#e0e0e0",
                      color: u.role === "admin" ? "#2d2d2d" : "#666"
                    }}>
                      {u.role === "admin" ? "👑 Admin" : "👤 Customer"}
                    </span>
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <span style={{
                      padding: "4px 12px",
                      borderRadius: "12px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      background: u.active ? "#d4edda" : "#f8d7da",
                      color: u.active ? "#155724" : "#721c24"
                    }}>
                      {u.active ? "✅ Attivo" : "❌ Disattivato"}
                    </span>
                  </td>
                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <button
                      style={{ 
                        padding: "8px 16px",
                        background: "#ff4dab",
                        color: "#fff",
                        border: "none",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontWeight: "500",
                        transition: "all 0.2s"
                      }}
                      onClick={() => handleDelete(u.id)}
                      onMouseOver={(e) => e.target.style.background = "#ff79c6"}
                      onMouseOut={(e) => e.target.style.background = "#ff4dab"}
                    >
                      🗑️ Elimina
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
