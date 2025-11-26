import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../API/products";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "60px 20px",
        fontSize: "1.2rem",
        color: "#ff4dab"
      }}>
        ⭐ Caricamento prodotti...
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}