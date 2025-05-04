import express from 'express'
import Authors from '../models/authorsSchema.js'
import { uploadAvatar } from '../middlewares/multer.js'
import { authMiddleware } from '../middlewares/auth.js'
import bcrypt from 'bcrypt'
import "dotenv/config"


const saltRounds = +process.env.SALT_ROUNDS // numero di cicli per la generazione dell'hash della password
const jwtsecretkey = process.env.JWT_SECRET_KEY // chiave segreta per la generazione del token JWT

const router = express.Router()


//Configurazione di multer per gestire il caricamento dei file
// const storage = multer.diskStorage({
//     destination:  function(req, file, cb) {
//         cb(null, 'uploads/') //cartella di destinazione
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname) //nome del file
//     }
// })

//creo un'istanza di multer con la configurazione di storage
// const upload = multer({ storage: storage, fileFilter: fileFilter }) 


//GET tutti gli autori
router.get('/', authMiddleware, async (req, res) => {
    try {
        const authors = await Authors.find()
        res.status(200).json(authors)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

//Endpoint con query di paginazione
router.get('/params', async (req, res) => {
    const limit = req.query.limit // parametro per il numero di autori per pagina
    const skip = (req.query.skip - 1) * limit //parametro per la pagina
    const sort = req.query.sort //parametro per l'ordinamento degli autori

    const filterdAuthors = await Authors.find().sort({ [sort]: 1 }).limit(limit).skip(skip) //cerco gli autori in base ai parametri di paginazione
    res.status(200).json(filterdAuthors) //restituisco gli autori filtrati

    //http://localhost:3001/authors/params?limit=3&skip=1&sort=name
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
// router.post('/', async (req, res) => {
//     const author = new Authors(req.body) //creo un un nuovo autore in base al modello basato sullo schema defiito con mongoose
//     try {
//         const newAuthor = await author.save() //salvo l'autore nel db
//         res.status(201).json(newAuthor) //restituisco l'autore appena creato
//     } catch (error) {
//         res.status(400).json({ message: error.message }) //restituisco un errore se non riesco a salvare l'autore
//     }
// })

router.post('/', authMiddleware, async (req, res) => {
    try {
        // Verifica se password è presente nel body
        if (!req.body.password) {
            return res.status(400).json({ message: 'Password is required' })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
        const author = new Authors({
            ...req.body,
            password: hashedPassword
        })
        const newAuthor = await author.save()
        
        // Remove password from response
        const authorWithoutPassword = { ...newAuthor._doc }
        delete authorWithoutPassword.password
        
        res.status(201).json(authorWithoutPassword)
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message })
    }
})


//PUT modifica un autore by id
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const author = await Authors.findByIdAndUpdate(req.params.id, req.body, { new: true }) //cerco l'autore in base all'id e lo aggiorno
        if (!author) return res.status(404).json({ message: 'Author not found' }) //se non trovo l'autore restituisco un errore
        res.status(200).json(author) //restituisco l'autore aggiornato
    } catch (error) {
        res.status(400).json({ message: error.message }) //restituisco un errore se non riesco a salvare l'autore
    }
})

//PATCH carico un'immagine avatar per un autore by id
router.patch('/:id/avatar', uploadAvatar, async (req, res) => {
    const id = req.params.id //prendo l'id dell'autore
    try {
        const authorUpdated = await Authors.findByIdAndUpdate(
            id,
            { avatar: req.file.path },
            { new: true }
        )
        res.status(200).json(authorUpdated) //restituisco l'autore aggiornato
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message }) //restituisco un errore se non riesco a salvare l'autore
    }
})


//DELETE elimina un autore by id
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const author = await Authors.findByIdAndDelete(req.params.id) //cerco l'autore in base all'id e lo elimino
        if (!author) return res.status(404).json({ message: 'Author not found' }) //se non trovo l'autore restituisco un errore
        res.status(200).json({ message: 'Author deleted' }) //restituisco un messaggio di conferma
    } catch (error) {
        res.status(500).json({ message: error.message }) //restituisco un errore se non riesco a salvare l'autore
    }
})


export default router;