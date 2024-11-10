import type { CartItem } from "@/interfaces"
import jscookie from "js-cookie"

export class CookieClient {

    static getCart():CartItem[] {
        return JSON.parse(jscookie.get("cart") || "[]")
    }

    static addItem(cartItem: CartItem):CartItem[] {
        const cart = CookieClient.getCart();
        const itemInCart = cart.find(item => item.productId === cartItem.productId && item.size === cartItem.size);

        if(itemInCart){
            itemInCart.quantity += cartItem.quantity;
        }else {
            cart.push(cartItem);
        }

        jscookie.set("cart", JSON.stringify(cart));
        return cart;
    }

    static removeItem(productId: string, size: string):CartItem[] {
        const cart = CookieClient.getCart();
        const newCart = cart.filter(item => item.productId !== productId && item.size !== size);
        jscookie.set("cart", JSON.stringify(newCart));
        return cart;
    }
}