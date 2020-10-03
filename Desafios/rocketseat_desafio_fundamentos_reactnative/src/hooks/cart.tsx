import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const STORAGE = '@GoMarketplace:products';

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const storagedProducts = await AsyncStorage.getItem(STORAGE);

      if (storagedProducts) {
        setProducts(JSON.parse(storagedProducts));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const produtoExist = products.find(p => p.id === product.id);

      let newProducts = [...products, { ...product, quantity: 1 }];

      if (produtoExist) {
        newProducts = products.map(p =>
          p.id === product.id ? { ...product, quantity: p.quantity + 1 } : p,
        );
      }

      setProducts(newProducts);
      await AsyncStorage.setItem(STORAGE, JSON.stringify(newProducts));
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const addProduct = products.map(p =>
        p.id === id ? { ...p, quantity: p.quantity + 1 } : p,
      );

      setProducts(addProduct);
      await AsyncStorage.setItem(STORAGE, JSON.stringify(addProduct));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const subProduct = products
        .map(p =>
          p.id === id
            ? { ...p, quantity: p.quantity - 1 <= 0 ? 0 : p.quantity - 1 }
            : p,
        )
        .filter(p => p.quantity > 0);

      setProducts(subProduct);
      await AsyncStorage.setItem(STORAGE, JSON.stringify(subProduct));
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
