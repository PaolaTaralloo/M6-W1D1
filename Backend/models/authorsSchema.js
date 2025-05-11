import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
    name: {type: String, required: true },
    surname: {type: String, required: true },
    email: {type: String,required: true,unique: true },
    born: {type: String, required: false},
    avatar: {type: String,required: false, default: 'https://ui-avatars.com/api/?name=User+Test'},
    post: [{type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    password: {type: String,required: true,select: false},
    verified: {type: Boolean,default: false }
}, {
    timestamps: true // Aggiunge createdAt e updatedAt
});

const Authors = mongoose.model("Author", authorSchema);
export default Authors;