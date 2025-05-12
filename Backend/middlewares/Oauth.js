import "dotenv/config";
import GoogleStrategy from 'passport-google-oauth20';
import Authors from "../models/authorsSchema.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; //bcrypt è una libreria per la crittografia delle password

const jwtsecretkey = process.env.JWT_SECRET_KEY;


const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, passportNext) => {
    try {
        const { email, given_name, family_name, email_verified, picture } = profile._json;

        const user = await Authors.findOne({ email });

        if (user) {
            const token = jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email
            }, jwtsecretkey, {
                expiresIn: '1y'
            });

            return passportNext(null, { user, token });
        }

        const newUser = new Authors({
            name: given_name,
            surname: family_name || '',
            email: email,
            verified: email_verified,
            avatar: picture,
            password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10)
        });

        const savedUser = await newUser.save();
        const token = jwt.sign({
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email
        }, jwtsecretkey, {
            expiresIn: '1y'
        });

        return passportNext(null, { user: savedUser, token });
    } catch (error) {
        console.error('Google Strategy Error:', error);
        return passportNext(error, null);
    }
});

export default googleStrategy;