import express from 'express'
import Posts from '../models/postsSchema.js'
import { uploadCover } from '../middlewares/multer.js'

const router = express.Router();

//GET tutti i posts
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find()
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

})

//Endpoint con query di paginazione
router.get('/params', async (req, res) => {
    const limit = req.query.limit // parametro per il numero di autori per pagina
    const skip = (req.query.skip - 1) * limit //parametro per la pagina
    const sort = req.query.sort //parametro per l'ordinamento degli autori

    const filterdPosts = await Posts.find().sort({ [sort]: 1 }).limit(limit).skip(skip) //cerco gli autori in base ai parametri di paginazione
    res.status(200).json(filterdPosts) //restituisco gli autori filtrati

    //http://localhost:3001/authors/params?limit=3&skip=1&sort=name
})


//GET post by id
router.get('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//POST creo un nuovo post
router.post('/', async (req, res) => {
    const post = new Posts(req.body) //creo un un nuovo post in base al modello basato sullo schema defiito con mongoose
    try {
        const newPost = await post.save() //salvo il post nel db
        res.status(201).json(newPost) //restituisco il post appena creato
    } catch (error) {
        res.status(400).json({ message: error.message }) //restituisco un errore se non riesco a salvare il post
    }
})

//PUT modifica un post by id
router.put('/:id', async (req, res) => {
    try {
        const post = await Posts.findByIdAndUpdate(req.params.id, req.body, { new: true }) //cerco il post in base all'id e lo aggiorno
        if (!post) return res.status(404).json({ message: 'Post not found' }) //se non trovo il post restituisco un errore
        res.status(200).json(post) //restituisco il post aggiornato
    } catch (error) {
        res.status(400).json({ message: error.message }) //restituisco un errore se non riesco a salvare il post
    }
})

//PATCH carico un'immagine cover per un post by id
router.patch('/:id/cover', uploadCover, async (req, res) => {
    const id = req.params.id //prendo l'id del post
    try {
        const postEdit = await Posts.findByIdAndUpdate(
            id,
            { cover: req.file.path },
            { new: true }
        )
        res.status(200).json(postEdit) //restituisco il post aggiornato
    } catch (error) {
        // console.log(error)
        // res.status(500).json({ message: error.message })
        next(error) //passo l'errore al middleware di gestione degli errori
    }
})

//DELETE elimina un post by id
router.delete('/:id', async (req, res) => {
    try {
        const post = await Posts.findByIdAndDelete(req.params.id) //cerco il post in base all'id e lo elimino
        if (!post) return res.status(404).json({ message: 'Post not found' }) //se non trovo il post restituisco un errore
        res.status(200).json({ message: 'Post deleted' }) //restituisco un messaggio di conferma
    } catch (error) {
        res.status(500).json({ message: error.message }) //restituisco un errore se non riesco a salvare il post
    }
})


export default router;