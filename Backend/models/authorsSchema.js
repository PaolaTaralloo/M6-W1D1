import mongoose from 'mongoose'; 


const authorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true},
    born: {type: String, required: true},
    avatar: {type: String, required: true},
    password: {type: String, required: true},
})

const Authors = mongoose.model("Author", authorSchema);
export default Authors;