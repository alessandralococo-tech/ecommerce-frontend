import React, { createContext, useReducer, useContext, useEffect } from "react";
import { getCartFromDB, saveCartToDB } from "../utils/indexedDB"; // funzioni per leggere/salvare il carrello su IndexedDB
import { createOrder } from "../api/cart"; // funzione per creare un ordine sul server

// Tipi di azione per il reducer
const ADD_ITEM = "ADD_ITEM";
const UPDATE_QUANTITY = "UPDATE_QUANTITY";
const REMOVE_ITEM = "REMOVE_ITEM";
const CLEAR_CART = "CLEAR_CART";
const SET_CART = "SET_CART";

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

      // Controlla la quantità e se è 0 o meno, rimuovi l'elemento
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
            ? { ...item, quantity } // aggiorna solo l'elemento corrispondente
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
  const [state, dispatch] = useReducer(cartReducer, { items: [] }); // inizializza il carrello vuoto

  // Carica il carrello dal DB all'avvio
  useEffect(() => {
    const loadCart = async () => {
      const savedCart = await getCartFromDB();
      if (savedCart && savedCart.length > 0) {
        dispatch({ type: SET_CART, payload: savedCart }); // aggiorna lo stato con il DB
      }
    };
    loadCart();
  }, []);

  // Salva il carrello sul DB ogni volta che cambia
  useEffect(() => {
    if (state.items.length >= 0) {
      saveCartToDB(state.items);
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
      throw new Error("Il carrello è vuoto"); // non si può fare il checkout se è vuoto
    }
    const order = await createOrder(state.items, shippingData); // invia ordine al server
    clearCart(); // svuota il carrello dopo l'ordine
    return order;
  };

  return (
    <CartContext.Provider
      value={{
        cart: state, // stato del carrello
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        checkout
      }}
    >
      {children} {/* rende il carrello disponibile a tutti i componenti figli */}
    </CartContext.Provider>
  );
};

// Hook personalizzato per usare il carrello facilmente nei componenti
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve essere usato dentro CartProvider");
  }
  return context;
};
