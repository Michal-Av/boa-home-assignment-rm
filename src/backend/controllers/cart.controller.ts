import { Request, Response, RequestHandler } from "express";
import { saveCartUC, getCartUC } from "../services/cart.service";


export const saveCart: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { shop, customerId, cartItems } = req.body;
    if (!shop || !customerId || !cartItems) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }
    
    const result = await saveCartUC(shop, customerId, cartItems);
    if (result.error) {
      res.status(400).json({ error: result.error }); 
      return;
    }

    res.json({ success: true, message: "Cart saved successfully!" }); 

  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ error: "Internal Server Error" }); 
  }
};
 
export const getCart: RequestHandler = async (req, res) => {
  try {
    const { shop, customerId } = req.query;
    if (!shop || !customerId) {
      res.status(400).json({ error: "Shop and customerId are required" });
      return;
    }
    const cart = await getCartUC(shop as string, customerId as string);
    if (!cart) {
      res.status(404).json({ error: "No saved cart found" });
      return;
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

