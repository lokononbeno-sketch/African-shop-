import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Boutique,
  CartItem,
  INITIAL_BOUTIQUES,
  INITIAL_PRODUITS,
  LocalOrder,
  OrderStatus,
  Product,
} from "../data/catalog";

interface UserSession {
  email: string;
  name: string;
  role: "vendor" | "admin";
}

interface ToastMessage {
  id: number;
  text: string;
  tone?: "success" | "info" | "error";
}

interface StoreContextValue {
  boutiques: Boutique[];
  produits: Product[];
  cart: CartItem[];
  favorites: string[];
  orders: LocalOrder[];
  user: UserSession | null;
  toast: ToastMessage | null;
  cartCount: number;
  getBoutique: (id: string) => Boutique | undefined;
  getProduct: (id: string) => Product | undefined;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  placeOrder: (info: {
    buyerName: string;
    buyerPhone: string;
    deliveryCity: string;
    deliveryAddress: string;
  }) => LocalOrder;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  createBoutique: (data: Omit<Boutique, "id" | "couleur" | "status">) => Boutique;
  updateBoutique: (id: string, data: Partial<Boutique>) => void;
  createProduct: (data: Omit<Product, "id">) => Product;
  updateOrderStatus: (orderId: string, productId: string, next: OrderStatus) => void;
  showToast: (text: string, tone?: ToastMessage["tone"]) => void;
}

const CART_KEY = "african_shop_cart_v1";
const FAV_KEY = "african_shop_favs_v1";
const SHOPS_KEY = "african_shop_custom_shops_v1";
const PRODS_KEY = "african_shop_custom_prods_v1";
const ORDERS_KEY = "african_shop_orders_v1";
const USER_KEY = "african_shop_user_v1";

const SHOP_PALETTE = ["#C84B24", "#1B6B4A", "#D9911A", "#1A2744", "#8F3B27"];

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const StoreContext = createContext<StoreContextValue | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customShops, setCustomShops] = useState<Boutique[]>(() =>
    readStorage<Boutique[]>(SHOPS_KEY, [])
  );
  const [shopEdits, setShopEdits] = useState<Record<string, Partial<Boutique>>>({});
  const [customProducts, setCustomProducts] = useState<Product[]>(() =>
    readStorage<Product[]>(PRODS_KEY, [])
  );
  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>(CART_KEY, []));
  const [favorites, setFavorites] = useState<string[]>(() =>
    readStorage<string[]>(FAV_KEY, [])
  );
  const [orders, setOrders] = useState<LocalOrder[]>(() =>
    readStorage<LocalOrder[]>(ORDERS_KEY, [
      {
        id: "demo-ord-1",
        orderNumber: "AS-2026-1042",
        createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        buyerName: "Amina K.",
        buyerPhone: "+229 01 97 45 22 10",
        deliveryCity: "Cotonou",
        deliveryAddress: "Fidjrossè, près du carrefour",
        totalFcfa: 19000,
        items: [
          {
            productId: "ex-wax",
            boutiqueId: "exemple-mode",
            title: "Pagne wax 6 yards",
            priceFcfa: 9500,
            quantity: 2,
            status: "pending_confirmation",
          },
        ],
      },
    ])
  );
  const [user, setUser] = useState<UserSession | null>(() =>
    readStorage<UserSession | null>(USER_KEY, null)
  );
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* ignore quota errors */
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    } catch {
      /* ignore */
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(SHOPS_KEY, JSON.stringify(customShops));
    } catch {
      /* ignore */
    }
  }, [customShops]);

  useEffect(() => {
    try {
      localStorage.setItem(PRODS_KEY, JSON.stringify(customProducts));
    } catch {
      /* ignore */
    }
  }, [customProducts]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      /* ignore */
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
  }, [user]);

  const showToast = (text: string, tone: ToastMessage["tone"] = "success") => {
    const id = Date.now();
    setToast({ id, text, tone });
    window.setTimeout(() => {
      setToast((prev) => (prev && prev.id === id ? null : prev));
    }, 3200);
  };

  const boutiques = useMemo(() => {
    const mergedInitial = INITIAL_BOUTIQUES.map((b) =>
      shopEdits[b.id] ? { ...b, ...shopEdits[b.id] } : b
    );
    return [...customShops, ...mergedInitial];
  }, [customShops, shopEdits]);

  const produits = useMemo(
    () => [...customProducts, ...INITIAL_PRODUITS],
    [customProducts]
  );

  const getBoutique = (id: string) => boutiques.find((b) => b.id === id);
  const getProduct = (id: string) => produits.find((p) => p.id === id);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const addToCart = (productId: string, quantity = 1) => {
    const prod = getProduct(productId);
    if (!prod || !prod.dispo) {
      showToast("Ce produit est actuellement indisponible.", "error");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((x) => x.product_id === productId);
      if (existing) {
        return prev.map((x) =>
          x.product_id === productId
            ? { ...x, quantity: Math.min(99, x.quantity + quantity) }
            : x
        );
      }
      return [...prev, { product_id: productId, quantity: Math.min(99, quantity) }];
    });
    showToast(`« ${prod.nom} » ajouté au panier`);
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((x) =>
        x.product_id === productId ? { ...x, quantity: Math.min(99, quantity) } : x
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((x) => x.product_id !== productId));
    showToast("Article retiré du panier", "info");
  };

  const clearCart = () => setCart([]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Retiré de tes coups de cœur", "info");
        return prev.filter((id) => id !== productId);
      }
      showToast("Ajouté à tes coups de cœur");
      return [...prev, productId];
    });
  };

  const placeOrder = (info: {
    buyerName: string;
    buyerPhone: string;
    deliveryCity: string;
    deliveryAddress: string;
  }): LocalOrder => {
    const orderItems = cart
      .map((item) => {
        const p = getProduct(item.product_id);
        if (!p) return null;
        return {
          productId: p.id,
          boutiqueId: p.boutique,
          title: p.nom,
          priceFcfa: p.prix,
          quantity: item.quantity,
          status: "pending_confirmation" as OrderStatus,
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));

    const totalFcfa = orderItems.reduce(
      (sum, item) => sum + item.priceFcfa * item.quantity,
      0
    );

    const newOrder: LocalOrder = {
      id: "ord-" + Date.now(),
      orderNumber: `AS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      buyerName: info.buyerName,
      buyerPhone: info.buyerPhone,
      deliveryCity: info.deliveryCity,
      deliveryAddress: info.deliveryAddress,
      totalFcfa,
      items: orderItems,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    showToast(`Commande ${newOrder.orderNumber} enregistrée !`);
    return newOrder;
  };

  const signIn = (email: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const displayName =
      name?.trim() ||
      cleanEmail
        .split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    setUser({ email: cleanEmail, name: displayName, role: "vendor" });
    showToast(`Bienvenue, ${displayName} !`);
  };

  const signOut = () => {
    setUser(null);
    showToast("Tu es déconnecté.", "info");
  };

  const createBoutique = (
    data: Omit<Boutique, "id" | "couleur" | "status">
  ): Boutique => {
    const slug =
      data.nom
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      Math.floor(100 + Math.random() * 900);
    const created: Boutique = {
      ...data,
      id: slug,
      couleur: SHOP_PALETTE[customShops.length % SHOP_PALETTE.length],
      verifie: true,
      ownerEmail: user?.email,
      status: "active",
    };
    setCustomShops((prev) => [created, ...prev]);
    showToast(`Boutique « ${created.nom} » publiée !`);
    return created;
  };

  const updateBoutique = (id: string, data: Partial<Boutique>) => {
    const isCustom = customShops.some((s) => s.id === id);
    if (isCustom) {
      setCustomShops((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      );
    } else {
      setShopEdits((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), ...data },
      }));
    }
    showToast("Boutique mise à jour !");
  };

  const createProduct = (data: Omit<Product, "id">): Product => {
    const created: Product = {
      ...data,
      id: "prod-" + Date.now(),
    };
    setCustomProducts((prev) => [created, ...prev]);
    showToast(`Produit « ${created.nom} » publié !`);
    return created;
  };

  const updateOrderStatus = (
    orderId: string,
    productId: string,
    next: OrderStatus
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item.productId === productId ? { ...item, status: next } : item
              ),
            }
          : order
      )
    );
    showToast("Statut de la commande mis à jour");
  };

  return (
    <StoreContext.Provider
      value={{
        boutiques,
        produits,
        cart,
        favorites,
        orders,
        user,
        toast,
        cartCount,
        getBoutique,
        getProduct,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleFavorite,
        placeOrder,
        signIn,
        signOut,
        createBoutique,
        updateBoutique,
        createProduct,
        updateOrderStatus,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore doit être utilisé dans StoreProvider");
  return ctx;
}
