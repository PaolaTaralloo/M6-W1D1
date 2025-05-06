import express from 'express'
import Authors from '../models/authorsSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import "dotenv/config"


const saltRounds = +process.env.SALT_ROUNDS // numero di cicli per la generazione dell'hash della password
const jwtsecretkey = process.env.JWT_SECRET_KEY // chiave segreta per la generazione del token JWT

const router = express.Router()


//POST registra un nuovo utente
router.post('/register', async (req, res) => {
    const password = req.body.password

    const user = new Authors({
        ...req.body,
        password: await bcrypt.hash(password, saltRounds) //salvo l'hash della password
    })
    const userSave = await user.save() //salvo l'utente nel db
    if (!userSave) {
        return res.status(400).json({ message: 'User not created' })
    }
    res.status(201).json(userSave) //restituisco l'utente appena creato
    try {
        const newUser = await user.save() //salvo l'utente nel db
        res.status(201).json(newUser) //restituisco l'utente appena creato
    } catch (error) {
        res.status(400).json({ message: error.message }) //restituisco un errore se non riesco a salvare l'utente
    }
})


//POST login di un utente
router.post('/login', async (req, res) => {
    const { email, password } = req.body // Destrutturo l'oggetto req.body per ottenere email e password

    try {    
        const user = await Authors.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign({ 
            id: user._id,
            name: user.name, 
            email: user.email
        }, jwtsecretkey, { 
            expiresIn: '1y'
        })

        const userWithoutPassword = { ...user._doc }
        delete userWithoutPassword.password // Rimuove la password dall'oggetto

        res.status(200).json({
            user: userWithoutPassword,
            token: token // Aggiungi il token nella risposta
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    } 
})

export default router 