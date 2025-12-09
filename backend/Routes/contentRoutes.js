import { createContent,getAllContent,getContentById,addGenre } from "../Controllers/contentController.js";
import express from "express";
const router = express.Router();
router.post("/user/:userId/create-content", createContent);
router.get("/user/:userId/content", getAllContent);
router.get("/content/:contentId", getContentById);
router.patch("/content/:contentId/add-genre", addGenre);

export default router;