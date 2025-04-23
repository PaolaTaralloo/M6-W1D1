import express from 'express'
import Authors from '../models/authorsSchema.js'

const router = express.Router()

//GET tutti gli autori
router.get('/', async (req, res) => {
    try {
        const authors = await Authors.find()
        res.status(200).json(authors)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


//GET autore by id
router.get('/:id', async (req, res) => {
    try {
        const author = await Authors.findById(req.params.id)
        if (!author) return res.status(404).json({ message: 'Author not found' })
        res.status(200).json(author)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//POST creo un nuovo autore
router.post('/', async (req, res) => {
    const author = new Authors(req.body) //creo un un nuovo autore in base al modello basato sullo schema defiito con mongoose
    try {
        const newAuthor = await author.save() //salvo l'autore nel db
        res.status(201).json(newAuthor) //restituisco l'autore appena creato
    } catch (error) {
        res.status(400).json({ message: error.message }) //restituisco un errore se non riesco a salvare l'autore
    }
})

//PUT modifica un autore by id
router.put('/:id', async (req, res) => {
    try {
        const author = await Authors.findByIdAndUpdate(req.params.id, req.body, { new: true }) //cerco l'autore in base all'id e lo aggiorno
        if (!author) return res.status(404).json({ message: 'Author not found' }) //se non trovo l'autore restituisco un errore
        res.status(200).json(author) //restituisco l'autore aggiornato
    } catch (error) {
        res.status(400).json({ message: error.message }) //restituisco un errore se non riesco a salvare l'autore
    }
})

//DELETE elimina un autore by id
router.delete('/:id', async (req, res) => {
    try {
        const author = await Authors.findByIdAndDelete(req.params.id) //cerco l'autore in base all'id e lo elimino
        if (!author) return res.status(404).json({ message: 'Author not found' }) //se non trovo l'autore restituisco un errore
        res.status(200).json({ message: 'Author deleted' }) //restituisco un messaggio di conferma
    } catch (error) {
        res.status(500).json({ message: error.message }) //restituisco un errore se non riesco a salvare l'autore
    }
})


export default router;