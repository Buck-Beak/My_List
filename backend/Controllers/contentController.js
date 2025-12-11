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

export const addGenre = async (req, res) => {
  const { contentId } = req.params;
  const { genre } = req.body;

  try {
    const updatedContent = await Content.findByIdAndUpdate(
      contentId,
      {
        $push: {
          genre: {
            title: genre,
            lists: []   // empty for now
          }
        }
      },
      { new: true }
    );

    if (!updatedContent) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.status(200).json(updatedContent);
  } catch (err) {
    console.error("Error adding genre:", err);
    res.status(500).json({ error: err.message });
  }
};

export const addItemToGenre = async (req, res) => {
  const { contentId, genreId } = req.params;
  const { title, content, imageUrl } = req.body;

  try {
    // Find the content and genre
    const contentDoc = await Content.findById(contentId);
    if (!contentDoc) return res.status(404).json({ error: "Content not found" });

    const genreObj = contentDoc.genre.id(genreId); // Mongoose subdocument
    if (!genreObj) return res.status(404).json({ error: "Genre not found" });

    // Add new list item
    genreObj.lists.push({ title, content, imageUrl });

    await contentDoc.save();

    res.status(200).json(contentDoc);
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/content/:contentId/:genreId/item/:itemId
export const getItemById = async (req, res) => {
  const { contentId, genreId, itemId } = req.params;

  try {
    const content = await Content.findById(contentId);
    console.log("Fetched content:", content);
    if (!content) return res.status(404).json({ error: "Content not found" });

    const genreObj = content.genre.id(genreId);
    if (!genreObj) return res.status(404).json({ error: "Genre not found" });

    const item = genreObj.lists.id(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    res.status(200).json(item);
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).json({ error: err.message });
  }
};
