import dotenv from "dotenv";
dotenv.config();
import { createContent,getAllContent,getContentById,addGenre,addItemToGenre,getItemById,getItemsByGenre
  ,getUserCategories
 } from "../Controllers/contentController.js";
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("Gemini API Key:", process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const router = express.Router();
router.post("/user/:userId/create-content", createContent);
router.get("/user/:userId/content", getAllContent);
router.get("/content/:contentId", getContentById);
router.patch("/content/:contentId/add-genre", addGenre);
router.patch("/content/:contentId/:genreId/add-item", addItemToGenre);
router.get("/content/:contentId/:genreId/item/:itemId", getItemById);
router.get("/content/:contentId/:genreId/items", getItemsByGenre);
router.get("/content/user/:userId/contents", getUserCategories);
router.post("/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      console.log("⚠️ No GEMINI_API_KEY found!");
      return res.status(500).json({ error: "Server missing API key" });
    }

    const result = await model.generateContent(prompt);

    if (!result?.response) {
      console.log("⚠️ No Gemini response:", result);
      return res.status(500).json({ error: "Empty Gemini response" });
    }

    const text = result.response.text();
    console.log("Gemini API Response:", text);

    res.json({ text });

  } catch (err) {
    console.log("Gemini API Error:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;