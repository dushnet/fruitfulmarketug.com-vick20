import { Cart,CartItem, createEmptyCart } from './cart-types';

const CART_STORAGE_KEY = "fruitflmarket_cart";


interface CartStoreItem {
    id: string;
    items: CartItem[];
    updatedAt: string;
}

//store thecart
export function storeCart(cart:Cart){
localStorage.setItem(
    CART_STORAGE_KEY,
    JSON.stringify(cart)
);

}

//read the stored cart
export function readStoredCart(): Cart {
    const storedCart = localStorage.getItem(
        CART_STORAGE_KEY
    );

    const cart: Cart = storedCart
        ? JSON.parse(storedCart)
        : createEmptyCart();

    cart.count = cart.items?.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cart.subtotal = cart.items?.reduce(
        (total, item) => total + item.quantity * item.unitPrice,
        0
    );

    return cart;
}