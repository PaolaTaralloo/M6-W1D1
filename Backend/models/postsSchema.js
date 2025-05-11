import mongoose from 'mongoose'; 


const postsSchema = new mongoose.Schema({
    category: {type: String, required: true},
    title: {type: String, required: true},
    cover: {type: String, required: true},
    readTime: {
        value: {type: Number, required: true},
        unit: {type: String, required: true}
    },
    author: {  // Modificato da array a singolo oggetto
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author', 
        required: true
    },
    content: {type: String, required: true},
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, {
    timestamps: true // aggiunto timestamps
})

const Posts = mongoose.model("Post", postsSchema);
export default Posts;

