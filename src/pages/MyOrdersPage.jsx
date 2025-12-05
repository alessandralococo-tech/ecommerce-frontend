import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getMyOrders, getOrderDetails } from "../api/orders";
import { getProductById } from "../api/products";

export default function MyOrdersPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState({});

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: "/my-orders" } });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getMyOrders();

        const sortedOrders = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setOrders(sortedOrders);
        setError(null);
      } catch (err) {
        console.error("Errore caricamento ordini:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated()) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleOrderClick = async (order) => {
    if (selectedOrder?.id === order.id) {
      setSelectedOrder(null);
      return;
    }

    if (order.itemsWithProducts) {
      setSelectedOrder(order);
      return;
    }

    setLoadingDetails((prev) => ({ ...prev, [order.id]: true }));

    try {
      const orderDetails = await getOrderDetails(order.id);

      const items =
        orderDetails.items ||
        orderDetails.order_items ||
        order.items ||
        order.order_items ||
        [];

      const itemsWithProducts = await Promise.all(
        items.map(async (item) => {
          try {
            const product = await getProductById(item.product_id);
            return { ...item, product };
          } catch {
            return {
              ...item,
              product: { name: "Prodotto non disponibile", image_url: null },
            };
          }
        })
      );

      const updatedOrder = { ...order, itemsWithProducts };

      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.id === order.id ? updatedOrder : o))
      );

      setSelectedOrder(updatedOrder);
    } catch (err) {
      console.error("Errore caricamento dettagli ordine:", err);
      alert("Impossibile caricare i dettagli dell'ordine");
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [order.id]: false }));
    }
  };

  // ⭐ MODIFICATO: Completed = Pagato
  const getStatusLabel = (status) => {
    const labels = {
      COMPLETED: "✓ Pagato",
      PENDING: "⏳ In attesa",
      CANCELLED: "✗ Annullato",
      PROCESSING: "🔄 In elaborazione",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      COMPLETED: "#10b981",
      PENDING: "#f59e0b",
      CANCELLED: "#ef4444",
      PROCESSING: "#3b82f6",
    };
    return colors[status] || "#6b7280";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            width: "60px",
            height: "60px",
            border: "5px solid rgba(255, 77, 171, 0.2)",
            borderTopColor: "#ff4dab",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <p style={{ marginTop: "20px", color: "#666" }}>Caricamento ordini...</p>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>📦 I miei ordini</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>
        Visualizza lo storico dei tuoi acquisti
      </p>

      {error && (
        <div
          style={{
            background: "#fee",
            border: "2px solid #ef4444",
            borderRadius: "15px",
            padding: "20px",
            marginBottom: "30px",
            color: "#ef4444",
          }}
        >
          <strong>⚠️ Errore:</strong> {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <h2>Nessun ordine ancora</h2>
          <button onClick={() => navigate("/shop")}>🛍️ Vai allo Shop</button>
        </div>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            border: "2px solid rgba(255, 121, 198, 0.2)",
            cursor: "pointer",
            marginBottom: "25px",
          }}
          onClick={() => handleOrderClick(order)}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3>Ordine #{order.id}</h3>
              <p>📅 {formatDate(order.created_at)}</p>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  background: getStatusColor(order.status) + "20",
                  color: getStatusColor(order.status),
                  borderRadius: "10px",
                  fontWeight: "600",
                }}
              >
                {getStatusLabel(order.status)}
              </div>

              <p style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#ff4dab" }}>
                €{order.total_price?.toFixed(2)}
              </p>
            </div>
          </div>

          {/* ⭐ INDIRIZZO RIMOSSO QUI */}

          {selectedOrder?.id === order.id && (
            <div style={{ marginTop: "20px" }}>
              <h4 style={{ marginBottom: "15px", color: "#ff4dab" }}>
                📋 Prodotti ordinati:
              </h4>

              {loadingDetails[order.id] ? (
                <p>Caricamento dettagli…</p>
              ) : order.itemsWithProducts?.length > 0 ? (
                order.itemsWithProducts.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      gap: "15px",
                      padding: "12px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {item.product.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        style={{ width: "60px", borderRadius: "8px" }}
                      />
                    )}

                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: "600" }}>{item.product.name}</p>
                      <p>Quantità: {item.quantity}</p>
                    </div>

                    <p style={{ fontWeight: "bold" }}>
                      €
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p>Nessun prodotto disponibile</p>
              )}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "10px", color: "#ff4dab" }}>
            {selectedOrder?.id === order.id
              ? "▲ Chiudi dettagli"
              : "▼ Vedi dettagli"}
          </div>
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button
  onClick={() => navigate("/shop")}
  style={{
    backgroundColor: "#ff4dab",
    color: "white",
    padding: "12px 24px",
    fontSize: "1.1rem",
    fontWeight: "600",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ff1aa3")}
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff4dab")}
>
  🛍️ Continua a fare shopping
</button>
      </div>
    </div>
  );
}
