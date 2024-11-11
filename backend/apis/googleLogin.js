import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config()

// Configure the Google strategy for use by Passport
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if the user already exists in our db
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            // User exists, return the user
            return done(null, user);
        } else {
            // If not, create a new user in our db
            user = await new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                password: null // Password is not needed for Google sign-in

            }).save();
            done(null, user);
        }
    } catch (error) {
        console.error(error);
        done(error, null);
    }
}));

// Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Route to start Google authentication
const googleLogin = passport.authenticate('google', {
    scope: ['profile', 'email']
});

// Callback route for Google to redirect to after authentication
const googleLoginCallBack = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/loginuser' }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/loginuser'); 
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err); // Handle login error
            }
            // Successful authentication, redirect to your desired route
            return res.redirect('/taskbygoogle');
        });
    })(req, res, next); // Call the authenticate function with req, res, and next
};

export { googleLogin, googleLoginCallBack }
