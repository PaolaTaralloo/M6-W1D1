import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    text: { 
        type: String, 
        required: true 
    }
}, { 
    timestamps: true // Questo sostituisce createdAt
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;