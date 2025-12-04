import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Header from "./components/Header";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import ProductAdminDetail from "./pages/ProductAdminDetail";
import CreateProductAdmin from "./pages/CreateProductAdmin";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import InformationPage from "./pages/InformationPage";
import ContactsPage from "./pages/ContactsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

import "./index.css";

// Componente protetto per pagine admin
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: "40px", textAlign: "center", marginTop: "80px" }}>⏳ Caricamento...</div>;
  if (!user || user.role !== "admin") return <Navigate to="/shop" />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Pagine pubbliche senza layout */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Layout con Header e Footer */}
            <Route
              path="/*"
              element={
                <div className="app-container">
                  <Header />
                  <main className="main-content">
                    <Routes>
                      {/* Shop e prodotti */}
                      <Route path="shop" element={<HomePage />} />
                      <Route path="products/:id" element={<ProductDetail />} />

                      {/* Pagine admin protette */}
                      <Route
                        path="admin/dashboard"
                        element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="admin/products/:id"
                        element={
                          <AdminRoute>
                            <ProductAdminDetail />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="admin/create-product"
                        element={
                          <AdminRoute>
                            <CreateProductAdmin />
                          </AdminRoute>
                        }
                      />

                      {/* Carrello, checkout e profilo */}
                      <Route path="cart" element={<Cart />} />
                      <Route path="checkout" element={<Checkout />} />
                      <Route path="profile" element={<ProfilePage />} />
                      
                      {/* Storico ordini utente */}

                      {/* Pagine footer */}
                      <Route path="information" element={<InformationPage />} />
                      <Route path="contacts" element={<ContactsPage />} />
                      <Route path="terms" element={<TermsPage />} />
                      <Route path="privacy" element={<PrivacyPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}