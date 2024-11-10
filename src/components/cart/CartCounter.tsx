import { useStore } from '@nanostores/react';
import { cartItems } from "@/store";
import { useEffect } from 'react';
import { CookieClient } from '@/utils';

export const CartCounter = () => {
  const $cartItems = useStore(cartItems);
  
  useEffect(() => {
    const cart = CookieClient.getCart();
    cartItems.set(cart?.length || 0);
  }, [])
  
  return (
    <a href="/cart" className="relative inline-block">
        <span className="absolute -top-2 -right-2 flex justify-center items-center rounded-full text-white bg-blue-500 w-5 h-5 font-bold " >
            {
              $cartItems
            }
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="1.7em" height="1.7em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}><path fill="currentColor" d="M19.5 22a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m-10 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3"></path><path d="M5 4h17l-2 11H7zm0 0c-.167-.667-1-2-3-2m18 13H5.23c-1.784 0-2.73.781-2.73 2s.946 2 2.73 2H19.5"></path></g></svg>
    </a>
  )
}
