import express from 'express'
import Posts from '../models/postsSchema.js'


const router = express.Router();

//GET tutti i posts
router.get ('/', async (req, res) => {
    try {
        const posts = await Posts.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
       
})

//GET post by id
router.get ('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//POST creo un nuovo post
router.post ('/', async (req, res) => {
    const post = new Posts(req.body) //creo un un nuovo post in base al modello basato sullo schema defiito con mongoose
    try {
        const newPost = await post.save() //salvo il post nel db
        res.status(201).json(newPost) //restituisco il post appena creato
    } catch (error) {
        res.status(400).json({ message: error.message }) //restituisco un errore se non riesco a salvare il post
    }
})

//PUT modifica un post by id
router.put ('/:id', async (req, res) => {
    try {
        const post = await Posts.findByIdAndUpdate(req.params.id , req.body, { new: true }) //cerco il post in base all'id e lo aggiorno
        if (!post) return res.status(404).json({ message: 'Post not found' }) //se non trovo il post restituisco un errore
        res.status(200).json(post) //restituisco il post aggiornato
    } catch (error) {
        res.status(400).json({ message: error.message }) //restituisco un errore se non riesco a salvare il post
    }
})

//DELETE elimina un post by id
router.delete ('/:id', async (req, res) => {
    try {
        const post = await Posts.findByIdAndDelete(req.params.id) //cerco il post in base all'id e lo elimino
        if (!post) return res.status(404).json({ message: 'Post not found' }) //se non trovo il post restituisco un errore
        res.status(200).json({ message: 'Post deleted' }) //restituisco un messaggio di conferma
    } catch (error) {
        res.status(500).json({ message: error.message }) //restituisco un errore se non riesco a salvare il post
    }
})


export default router;