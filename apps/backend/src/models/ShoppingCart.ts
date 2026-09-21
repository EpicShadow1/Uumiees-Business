import { ShoppingCart as SharedShoppingCart, CreateShoppingCart as SharedCreateShoppingCart, CartItem, CreateCartItem, UpdateCartItem } from '@uumiees/types';

export type ShoppingCart = SharedShoppingCart;
export type CreateShoppingCart = SharedCreateShoppingCart;
export { CartItem, CreateCartItem, UpdateCartItem } from '@uumiees/types';