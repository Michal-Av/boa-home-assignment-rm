import express, { Router } from "express";
import { saveCart, getCart, addToCart } from "../controllers/cart.controller";
import { validateSaveCart, validateGetCart } from "../validations/cart.validator";
import validateResource from "../middleware/validateResource";

const router: Router = express.Router();

router.post("/save", validateResource(validateSaveCart, "body"), saveCart);
router.get("/retrieve", validateResource(validateGetCart, "query"), getCart);
router.post("/add-to-cart", addToCart);

export default router;
