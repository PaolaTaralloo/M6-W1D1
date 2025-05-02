import mongoose from 'mongoose'; 
import commentSchema from './commentsSchema.js'


const postsSchema = new mongoose.Schema({
    category: {type: String, required: true},
    title: {type: String, required: true},
    cover: {type: String, required: true},
    readTime: {
        value: {type: Number, required: true},
        unit: {type: String, required: true}
    },
    author: {type: String, required: true},
    content: {type: String, required: true},
    comments: [commentSchema]
})
const Posts = mongoose.model("Post", postsSchema);
export default Posts;

