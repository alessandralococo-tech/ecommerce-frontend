import React, { createContext, useReducer, useContext, useEffect } from "react";
import { createOrder } from "../api/cart";

// Tipi di azione per il reducer
const ADD_ITEM = "ADD_ITEM";
const UPDATE_QUANTITY = "UPDATE_QUANTITY";
const REMOVE_ITEM = "REMOVE_ITEM";
const CLEAR_CART = "CLEAR_CART";
const SET_CART = "SET_CART";

// Chiave per il localStorage
const CART_STORAGE_KEY = "starshop_cart";

// Reducer del carrello che gestisce tutte le modifiche allo stato
const cartReducer = (state, action) => {
  switch (action.type) {
    case ADD_ITEM: {
      const { product, quantity } = action.payload;

      // Controlla se il prodotto è già presente nel carrello
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex >= 0) {
        // Aggiorna la quantità se il prodotto già esiste
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity
        };
        return { ...state, items: newItems };
      } else {
        // Se non esiste, lo aggiunge
        return {
          ...state,
          items: [...state.items, { product, quantity }]
        };
      }
    }

    case UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;

      // Se la quantità è 0 o meno, rimuovi l'elemento
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.product.id !== productId)
        };
      }

      // Altrimenti aggiorna la quantità
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      };
    }

    case REMOVE_ITEM:
      // Rimuove un elemento in base all'id del prodotto
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload)
      };

    case CLEAR_CART:
      // Svuota completamente il carrello
      return { ...state, items: [] };

    case SET_CART:
      // Imposta il carrello con un array già esistente
      return { ...state, items: action.payload };

    default:
      return state;
  }
};

// Creazione del contesto globale per il carrello
const CartContext = createContext();

// Provider che avvolge l'app e rende disponibile il carrello
export const CartProvider = ({ children }) => {
  // Inizializza il carrello caricando da localStorage
  const initialState = () => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return { items: saved ? JSON.parse(saved) : [] };
    } catch (error) {
      console.error("Errore caricamento carrello:", error);
      return { items: [] };
    }
  };

  const [state, dispatch] = useReducer(cartReducer, null, initialState);

  // Salva il carrello in localStorage ogni volta che cambia
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch (error) {
      console.error("Errore salvataggio carrello:", error);
    }
  }, [state.items]);

  // Funzioni per modificare il carrello
  const addItem = (product, quantity = 1) => {
    dispatch({ type: ADD_ITEM, payload: { product, quantity } });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: UPDATE_QUANTITY, payload: { productId, quantity } });
  };

  const removeItem = (productId) => {
    dispatch({ type: REMOVE_ITEM, payload: productId });
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  const checkout = async (shippingData) => {
    if (state.items.length === 0) {
      throw new Error("Il carrello è vuoto");
    }
    const order = await createOrder(state.items, shippingData);
    clearCart();
    return order;
  };

  // Calcola il totale degli articoli
  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Calcola il totale del prezzo
  const getTotalPrice = () => {
    return state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        checkout,
        getTotalItems,
        getTotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook per usare il carrello nei componenti
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve essere usato dentro CartProvider");
  }
  return context;
};