import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./config/db";
import cartRoutes from "./routes/cart.route";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

app.use("/shopify/cart", cartRoutes);

const PORT = process.env.PORT || 3000;

db.getConnection()
  .then(() => {
    console.log("Connected to MySQL database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MySQL:", err);
    process.exit(1);
  });

export default app;
