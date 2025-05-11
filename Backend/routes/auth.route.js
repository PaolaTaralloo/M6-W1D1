import express from 'express'
import Authors from '../models/authorsSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import "dotenv/config"
import passport from 'passport'

const router = express.Router()
const saltRounds = +process.env.SALT_ROUNDS
const jwtsecretkey = process.env.JWT_SECRET_KEY

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign({ 
        id: user._id,
        name: user.name, 
        email: user.email
    }, jwtsecretkey, { 
        expiresIn: '1y'
    })
}

// POST register route
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, surname } = req.body

        // Validate required fields
        if (!email || !password || !name || !surname) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        // Check if user already exists
        const existingUser = await Authors.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds)
        
        const user = new Authors({
            ...req.body,
            password: hashedPassword
        })

        const newUser = await user.save()
        
        // Remove password from response
        const userWithoutPassword = { ...newUser._doc }
        delete userWithoutPassword.password

        res.status(201).json(userWithoutPassword)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error during registration' })
    }
})

// POST login route
router.post('/login', async (req, res) => {
    try {    
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const user = await Authors.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        const token = generateToken(user)
        const userWithoutPassword = { ...user._doc }
        delete userWithoutPassword.password

        res.status(200).json({
            user: userWithoutPassword,
            token
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error during login' })
    } 
})

// Google Auth routes
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
)



router.get('/google/callback', 
    passport.authenticate('google', { 
        session: false, 
        failureRedirect: '/auth/login' 
    }),
    async (req, res) => {
        try {
            const { user, token } = req.user;
            
            // Redirect to frontend with both user data and token
            res.redirect(
                `${process.env.FRONTEND_URL}/auth/success?` + 
                `token=${token}&` +
                `userId=${user._id}`
            );
        } catch (error) {
            console.error(error);
            res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
        }
    }
);

export default router