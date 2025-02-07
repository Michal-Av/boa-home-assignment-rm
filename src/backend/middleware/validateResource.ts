import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const validateResource =
  (schema: Joi.ObjectSchema, source: "body" | "query") =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const input = source === "body" ? req.body : req.query;
      const { error } = schema.validate(input, { abortEarly: false });

      if (!error) {
        next();
      } else {
        const errorMessage = error.details.map((detail) => detail.message).join(", ");
        console.error("Validation error:", errorMessage);
        res.status(400).json({ error: errorMessage });
      }
    } catch (e) {
      console.error("Validation middleware error:", e);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

export default validateResource;
