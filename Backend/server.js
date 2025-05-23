
import express from 'express'; 
import cors from 'cors'; // Import CORS middleware
import "dotenv/config"; // Import dotenv to load environment variables
import db from './db.js'; // Import the connectDB function
import authorRoutes from './routes/authors.route.js'; // Import author routes
import postRoutes from './routes/posts.route.js'; // Import post routes
import authRoutes from './routes/auth.route.js'; // Import auth routes
import usersRoutes from './routes/users.route.js'; // Import user routes
import passport from 'passport';
import googleStrategy from './middlewares/Oauth.js';


const app = express();
app.use(cors()); // Use CORS middleware to allow cross-origin requests
app.use(express.json()); // Middleware to parse JSON request bodies
passport.use(googleStrategy); // Use the Google strategy for authentication

//Registra le routes
app.use('/authors', authorRoutes); //imposto la rotta per gli autori con il prefisso '/authors'
app.use('/posts', postRoutes); //imposto la rotta per i post con il prefisso '/posts'
app.use('/auth', authRoutes); //imposto la rotta per gli utenti con il prefisso '/auth'
app.use('/users', usersRoutes); //imposto la rotta per gli utenti con il prefisso '/users'

// Connessione al DB
db()

//Per start del server
app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
}) 