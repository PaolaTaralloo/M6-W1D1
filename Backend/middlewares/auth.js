import jwt from 'jsonwebtoken'
import "dotenv/config"
import Authors from '../models/authorsSchema.js'

const jwtsecretkey = process.env.JWT_SECRET_KEY

const authMiddleware = async (req, res, next) => {
    try {
     
        const tokenBearer = req.headers.authorization
        if (!tokenBearer) {
            return res.status(401).json({ message: 'Token not provided' })
        }
       
        const token = tokenBearer.replace('Bearer ', '')
        try {
            const verified = jwt.verify(token, jwtsecretkey)
            
            // Verifica se l'utente esiste ancora nel database
            const user = await Authors.findById(verified.id)
            if (!user) {
                return res.status(401).json({ message: 'User no longer exists' })
            }

            // Aggiungi l'utente alla request per uso successivo
            req.user = user
            next()
        } catch (error) {
            return res.status(403).json({ message: 'Invalid token' })
        }
    } catch (error) {
        next(error)
    }
}

export { authMiddleware }