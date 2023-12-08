import passport from 'passport';
import flash from 'express-flash';

import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {variables} from "./index.js";

const TAG = "PASSPORT_CONFIG";
const {
    JWT_ACCESS
} = variables;
import session from "express-session";
import AuthService from "../services/auth.service.js";
import Account from "../models/account.model.js";

console.log(TAG,"JWT_ACCESS", JWT_ACCESS)
const jwtOptions = {
    jwtFromRequest: function ( req ) {
        let token = null, refreshToken = null;
        if (req && req.cookies) {
            token = req.cookies['token'];
        }

        if (!token) {
            return null;
        }

        console.log(TAG, "token", token)
        return token;
    },
    secretOrKey: JWT_ACCESS
}

const localOptions = {
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}
const localStrategy = new LocalStrategy(localOptions, async ( req, username, password, done ) => {
    try {
        const body = {
            username: req.body.username,
            password: req.body.password
        }
        const remember = req.body?.remember;
        console.log("remember", remember)

        const signIn = await AuthService.authenticate(body);
        switch (signIn.status) {
            case 400: {
                return done(null, false, { message: signIn.message });
            }
            case 500: {
                if (variables.ENV === "development") {
                    return done(null, false, { message: signIn.message, cause: signIn.cause });
                } else {
                    return done(null, false, { message: signIn.message });
                }
            }
            default: {
                return done(null, signIn, {
                    remember: {
                        remember,
                        token: signIn.refreshToken
                    }
                });
            }
        }
    } catch (e) {
        return done(e);
    }
})

const strategy = new JwtStrategy(jwtOptions, async ( payload, done ) => {
    try {
        console.log("payload", payload)
        const account = await Account.findOne({
            username: payload.username
        })

        if (!account) {
            return done(null, false);
        }

        return done(null, account);
    } catch (e) {
        console.log(e)
        return done(e);
    }
});

const googleStrategy = new GoogleStrategy({
    clientID: variables.GG_CLIENT_ID,
    clientSecret: variables.GG_CLIENT_SECRET,
    callbackURL: variables.GG_CALLBACK_URL
}, async function ( accessToken, refreshToken, profile, done ) {
    try {
        const account = await Account.findOne({
            email: profile.emails[0].value
        });
        if (account) {
            if (account.logging) {
                return done(null, account);
            } else {
                return done(null, false, { message: "The account has not changed its password. Please change your password before login" });
            }
        } else {
            return done(null, false, { message: "Account not found" });
        }
    } catch (e) {
        console.log(e)
        return done(e);
    }
});

export default function passportConfig( app ) {
    //     config session
    app.use(session({
        secret: variables.JWT_ACCESS,
        resave: true,
        saveUninitialized: true
    }));

    app.use(flash());

    passport.serializeUser(( user, done ) => {
        done(null, user._id);
    });

    passport.deserializeUser(async ( id, done ) => {
        try {
            const user = await Account.findById(id);
            return done(null, user);
        } catch (e) {
            console.log(e)
            return done(e);
        }
    })

    passport.use('local', localStrategy);
    passport.use('google', googleStrategy);
    passport.use('jwt', strategy);
    app.use(passport.initialize());
    app.use(passport.session());
    return {
        status: '✅',
        message: 'Passport config successfully'
    }
}
