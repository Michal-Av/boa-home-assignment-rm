import express, { Router } from "express";
import { saveCart, getCart } from "../controllers/cart.controller";
import { validateSaveCart, validateGetCart } from "../validations/cart.validator";
import validateResource from "../middleware/validateResource";

const router: Router = express.Router();

router.post("/save", validateResource(validateSaveCart, "body"), saveCart);
router.get("/retrieve", validateResource(validateGetCart, "query"), getCart);

export default router;
