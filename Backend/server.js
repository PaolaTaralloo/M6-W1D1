
import express from 'express'; 
import cors from 'cors'; // Import CORS middleware
import "dotenv/config"; // Import dotenv to load environment variables
import db from './db.js'; // Import the connectDB function
import authorRoutes from './routes/authors.route.js'; // Import author routes
import postRoutes from './routes/posts.route.js'; // Import post routes
import authRoutes from './routes/auth.route.js'; // Import auth routes


const app = express();
app.use(cors()); // Use CORS middleware to allow cross-origin requests
app.use(express.json()); // Middleware to parse JSON request bodies


//Registra le routes
app.use('/authors', authorRoutes); //imposto la rotta per gli autori con il prefisso '/authors'
app.use('/posts', postRoutes); //imposto la rotta per i post con il prefisso '/posts'
app.use('/auth', authRoutes); //imposto la rotta per gli utenti con il prefisso '/auth'


// Connessione al DB
db()

//Per start del server
app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
}) 