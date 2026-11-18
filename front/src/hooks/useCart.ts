//this is where the cart is updated 
import {useContext, useState} from 'react';
import { CartContext } from '../contexts/CartContext';

export default function useCart(){
   const context = useContext(CartContext);
   if(!context) throw new Error("cart need to be used with in a cartcontext");
   return context;
}