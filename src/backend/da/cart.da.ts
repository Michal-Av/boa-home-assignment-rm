import db from "../config/db";
import { Cart } from "../models/cart.model";

const SHOPIFY_CART_URL = "https://home-assignment-259.myshopify.com/api/2024-01/graphql.json";
const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_API_KEY;

export async function saveCartDA(shop: string, customerId: string, cartData: object): Promise<void> {
  await db.execute(
    "INSERT INTO carts (shop, customerId, cartItems) VALUES (?, ?, ?)",
    [shop, customerId, JSON.stringify(cartData)]
  );
}

export async function getCartByCustomerId(customerId: string): Promise<Cart | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const [rows]: any = await db.query("SELECT * FROM carts WHERE customerId = ?", [customerId]);

      if (rows.length > 0) {
        resolve(rows[0] as Cart); 
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export async function getCartIdByCustomer(customerId: string): Promise<string> {
  const cart = await getCartByCustomerId(customerId);
  return cart?.id ?? "";
}

export async function deleteCartByCustomerId(customerId: string): Promise<void> {
  await db.execute("DELETE FROM carts WHERE customerId = ?", [customerId]);
}

export async function getCartDA(shop: string, customer_id: string): Promise<Cart | null> {
  const [rows]: any = await db.execute(
    "SELECT * FROM carts WHERE shop = ? AND customerId = ? ORDER BY created_at DESC LIMIT 1",
    [shop, customer_id]
  );
  return rows.length > 0 ? rows[0] : null;
}