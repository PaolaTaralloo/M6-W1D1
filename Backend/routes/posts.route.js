import express from 'express'
import Posts from '../models/postsSchema.js'
import Comment from '../models/commentsSchema.js'
import { uploadCover } from '../middlewares/multer.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = express.Router();

//GET tutti i posts
router.get('/', authMiddleware, async (req, res) => {
    try {
        const posts = await Posts.find()
            .populate('author') // era 'Author' (maiuscolo), deve essere 'author' (minuscolo)
            .populate('comments') // opzionale: popola anche i commenti se necessario
        res.status(200).json(posts)
    } catch (error) {
        console.error('Error fetching posts:', error); // aggiungi log dell'errore
        res.status(500).json({ message: error.message })
    }

})

//Endpoint con query di paginazione
router.get('/params', async (req, res) => {
    try {
        const limit = req.query.limit 
        const skip = (req.query.skip - 1) * limit
        const sort = req.query.sort

        const filteredPosts = await Posts.find()
            .populate('author')  // correzione: 'Authors' -> 'author'
            .sort({ [sort]: 1 })
            .limit(Number(limit))
            .skip(Number(skip))
        
        res.status(200).json(filteredPosts)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
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
router.post('/', authMiddleware, async (req, res) => {
    const post = new Posts(req.body) //creo un un nuovo post in base al modello basato sullo schema defiito con mongoose
    try {
        const newPost = await post.save() //salvo il post nel db
        res.status(201).json(newPost) //restituisco il post appena creato
    } catch (error) {
        res.status(400).json({ message: error.message }) //restituisco un errore se non riesco a salvare il post
    }
})

//PUT modifica un post by id
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Posts.findByIdAndUpdate(req.params.id, req.body, { new: true }) //cerco il post in base all'id e lo aggiorno
        if (!post) return res.status(404).json({ message: 'Post not found' }) //se non trovo il post restituisco un errore
        res.status(200).json(post) //restituisco il post aggiornato
    } catch (error) {
        res.status(400).json({ message: error.message }) //restituisco un errore se non riesco a salvare il post
    }
})

//PATCH carico un'immagine cover per un post by id
router.patch('/:id/cover', uploadCover, async (req, res, next) => { // aggiunto next
    const id = req.params.id
    try {
        const postEdit = await Posts.findByIdAndUpdate(
            id,
            { cover: req.file.path },
            { new: true }
        )
        res.status(200).json(postEdit)
    } catch (error) {
        next(error)
    }
})

//DELETE elimina un post by id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Posts.findByIdAndDelete(req.params.id) //cerco il post in base all'id e lo elimino
        if (!post) return res.status(404).json({ message: 'Post not found' }) //se non trovo il post restituisco un errore
        res.status(200).json({ message: 'Post deleted' }) //restituisco un messaggio di conferma
    } catch (error) {
        res.status(500).json({ message: error.message }) //restituisco un errore se non riesco a salvare il post
    }
})

//GET tutti i commenti
router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id).populate('comments')
        if (!post) return res.status(404).json({ message: 'Post not found' })
        res.status(200).json(post.comments)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//GET di un commento by id
router.get('/:id/comments/:commentId', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if (!comment) return res.status(404).json({ message: 'Comment not found' })
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


//POST di un commento
router.post('/:id/comments', async (req, res) => {
    try {
        // 1. Trova il post
        const post = await Posts.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }

        // 2. Crea il nuovo commento
        const comment = new Comment({
            author: req.body.author,
            text: req.body.text
        })

        // 3. Salva il commento
        const savedComment = await comment.save()

        // 4. Aggiungi il riferimento del commento al post
        post.comments.push(savedComment._id)
        await post.save()

        // 5. Restituisci il commento creato
        res.status(201).json(savedComment)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//PUT modifica un commento by id
router.put('/:id/comments/:commentId', async (req, res) => {
    try {
        const comment = await Comment.findByIdAndUpdate( //cerco il commento in base all'id e lo aggiorno
            req.params.commentId, //cerco il commento in base all'id
            req.body, //prendo il body della richiesta
            { new: true }// restituisco il commento aggiornato
        )
        if (!comment) return res.status(404).json({ message: 'Comment not found' }) //se non trovo il commento restituisco un errore
        res.status(200).json(comment)
    } catch (error) {
        res.status(400).json({ message: error.message }) //restituisco un errore se non riesco a salvare il commento
    }
})

//DELETE elimina un commento by id
router.delete('/:id/comments/:commentId', async (req, res) => {
    try {
        // Rimuovi il commento dalla collezione comments
        const comment = await Comment.findByIdAndDelete(req.params.commentId)
        if (!comment) return res.status(404).json({ message: 'Comment not found' })
        
        // Rimuovi il riferimento dal post
        await Posts.findByIdAndUpdate(
            req.params.id,
            { $pull: { comments: req.params.commentId } }
        )
        
        res.status(200).json({ message: 'Comment deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})



export default router;