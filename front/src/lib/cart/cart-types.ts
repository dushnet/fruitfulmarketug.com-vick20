export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  count?: number;
  subtotal?: number;
  updatedAt?: string;
}


export interface CartContextType {
  cart: Cart;
  count: number;
  subtotal: number;
  isReady: boolean;

  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (
    variantId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  updateSubtotal: ()=> void;
}

export function createEmptyCart(): Cart {
  return {
    id: crypto.randomUUID(),
    items: [],
    updatedAt: new Date().toISOString(),
  };
}

