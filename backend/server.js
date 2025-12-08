import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRoutes from "./Routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`connected to db and listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
