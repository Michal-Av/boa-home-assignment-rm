import { saveCartDA, getCartDA, getCartByCustomerId, deleteCartByCustomerId} from "../da/cart.da";
import { Cart } from "../models/cart.model";


export async function saveCartUC(shop: string, customerId: string, cartItems: object): Promise<{ success?: boolean; error?: string }> {
  try {
      const existingCart = await getCartByCustomerId(customerId);
      if (existingCart) {
    
          await deleteCartByCustomerId(customerId);
      }
      
      await saveCartDA(shop, customerId, cartItems);
      return { success: true };

  } catch (error) {
      console.error("Service Error:", error);
      return { error: "Failed to save cart." };
  }
}

export async function getCartUC(shop: string, customerId: string): Promise<Cart | null> {
  return await getCartDA(shop, customerId);
}


