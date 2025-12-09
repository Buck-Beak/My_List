import User from "../Models/userModel.js";
import Content from "../Models/contentModel.js";

export const createContent = async (req, res) => {
  try {
    const { category, genre, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    /*if (!genre || !Array.isArray(genre)) {
      return res.status(400).json({ error: "Genre must be an array" });
    }*/

    const newContent = new Content({
      category,
      genre,     // [{ title, lists: [...] }]
      user: userId,
    });

    await newContent.save();

    res.status(201).json({
      message: "Content created successfully",
      content: newContent,
    });

  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({
      error: `Server error while creating content: ${error.message}`
    });
  }
};
export const getAllContent = async (req, res) => {
  const { userId } = req.params;

  try {
    const contents = await Content.find({ user: userId });

    res.status(200).json(contents);
  } catch (error) {
    console.error("Error fetching contents:", error);
    res.status(500).json({
      error: `Server error while fetching contents: ${error.message}`,
    });
  }
};
export const getContentById = async (req, res) => {
  const { contentId } = req.params;

  try {
    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }
    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: error.message });
  }
};

