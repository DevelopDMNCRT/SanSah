import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const cartItemId = product.cartItemId || product.id;
      const existing = prevItems.find((item) => (item.cartItemId || item.id) === cartItemId);
      if (existing) {
        return prevItems.map((item) =>
          (item.cartItemId || item.id) === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1, cartItemId }];
    });
  };

  const removeFromCart = (identifier) => {
    setCartItems((prevItems) => prevItems.filter((item) => (item.cartItemId || item.id) !== identifier));
  };

  const updateQuantity = (identifier, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if ((item.cartItemId || item.id) === identifier) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, item) => {
    const priceNum = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
    return total + (priceNum * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
