//const express = require('express');
import express from 'express'; 
import "dotenv/config"; // Import dotenv to load environment variables
import db from './db.js'; // Import the connectDB function

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.get('/', (req, res) => {
    res.send('Hello World!');
})

db()


app.post("/", (req, res) => {
    res.json(req.body);
})


app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
})