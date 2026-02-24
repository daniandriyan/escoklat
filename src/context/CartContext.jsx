import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product_id === product.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.product_id === product.id
            ? { ...item, qty: item.qty + 1, subtotal: (item.qty + 1) * item.price }
            : item
        );
      }
      
      return [...prev, {
        product_id: product.id,
        name: product.name,
        variant: product.variant,
        price: product.price,
        qty: 1,
        subtotal: product.price,
      }];
    });
    
    // Auto open cart on mobile when adding item
    if (window.innerWidth < 1024) {
      setIsCartOpen(true);
    }
  }, []);

  const updateQty = useCallback((productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.product_id === productId
          ? { ...item, qty, subtotal: qty * item.price }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.product_id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
