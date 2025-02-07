import { saveCartDA, getCartDA, getCartByCustomerId, deleteCartByCustomerId, addToShopifyCart, getCartIdByCustomer, createNewCart} from "../da/cart.da";
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


export async function addToCartUC(customerId: string, cartItems: any[]) {
  try {
    let cartId = await getCartIdByCustomer(customerId);

    if (!cartId) {
      cartId = await createNewCart();
      console.log("New cart created:", cartId);
    }

    
    const formattedCartId = `gid://shopify/Cart/${cartId}`;

    const response = await addToShopifyCart(formattedCartId, cartItems);
    
    return { success: true, data: response };
  } catch (error) {
    console.error("Service Error - Failed to add to cart:", error);
    return { success: false, error: "Failed to add to cart" };
  }
}
