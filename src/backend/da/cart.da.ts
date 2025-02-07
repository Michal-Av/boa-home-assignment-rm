import { shopifyApp } from '@shopify/shopify-app-express';
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


export async function addToShopifyCart(cartId: string, cartItems: any[]) {
  try {
    console.log("🛒 Sending request to Shopify:", SHOPIFY_CART_URL, cartId, cartItems);

    const response = await fetch(SHOPIFY_CART_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN || "",
      },
      body: JSON.stringify({
        query: `
          mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart {
                id
                lines(first: 10) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          cartId, 
          lines: cartItems.map(item => ({
            merchandiseId: `gid://shopify/ProductVariant/${item.id}`,
            quantity: item.quantity || 1,
          })),
        },
      }),
    });

    const jsonResponse = await response.json();
    console.log("Shopify GraphQL Response:", JSON.stringify(jsonResponse, null, 2));

    return jsonResponse;
  } catch (error) {
    console.error("DA Error - Failed to add to Shopify cart:", error);
    throw new Error("Failed to add to Shopify cart");
  }
}


export async function createNewCart(): Promise<string> {
  const response = await fetch(SHOPIFY_CART_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN || "",
    },
    body: JSON.stringify({
      query: `
        mutation {
          cartCreate {
            cart {
              id
            }
          }
        }
      `,
    }),
  });

  const data = await response.json();
  if (data.errors) {
    throw new Error("Failed to create cart");
  }

  return data.data.cartCreate.cart.id;
}
