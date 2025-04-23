import mongoose from 'mongoose'; 


const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
})

// const authorSchema = new mongoose.Schema({
//     name: {type: String, required: true},
//     surname: {type: String, required: true},
//     email: {type: String, required: true},
//     born: {type: String, required: true},
//     avatar: {type: String, required: true},
// })

// const Authors = mongoose.model("Author", authorSchema);
// export default Authors;
