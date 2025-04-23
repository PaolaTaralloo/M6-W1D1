import Authors from '../models/authorsSchema.js';
import express from 'express';

const router = express.Router();
//GET tutti gli autori
router.get = ('/', async (req, res) => {
        const authors = await Authors.find();
        res.status(200).json(authors);
})

//GET autore by id

export default router;