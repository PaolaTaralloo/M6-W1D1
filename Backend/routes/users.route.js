import express from 'express'
import "dotenv/config"
import {authMiddleware} from '../middlewares/auth.js' // Importa il middleware di autenticazione


const router = express.Router()

//GET restituisce l'utente autenticato
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // Controlla se l'utente è autenticato
        res.status(200).json(req.user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})


export default router 