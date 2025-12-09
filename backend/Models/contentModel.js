import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false,
    },
    content: {
        type: String,
        required: false,
    },
    imageUrl: {
        type: String, 
        required: false,
    }
}
)

const genreSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    lists: [ListSchema]
})

const ContentSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
        },
        genre: [genreSchema],
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    }
)

export default mongoose.model("Content", ContentSchema);