import passport from 'passport';
import flash from 'express-flash';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import {variables} from "./index.js";

import session from "express-session";
import AuthService from "../services/auth.service.js";
import Account from "../models/account.model.js";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: variables.JWT_ACCESS
}

const localOptions = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}
const localStrategy = new LocalStrategy(localOptions, async ( req, email, password, done ) => {
    try {
        const {body} = req;

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
                return done(null, signIn);
            }
        }
    } catch (e) {
        return done(e);
    }
})

const strategy = new Strategy(jwtOptions, async ( payload, done ) => {
    try {
        const account = await Account.findOne({
            email: payload.email
        })

        if (!account) {
            return done(null, false);
        }

        return done(null, account);
    } catch (e) {
        return done(e);
    }
});

export default function passportConfig( app ) {
    //     config session
    app.use(session({
        secret: variables.JWT_ACCESS,
        resave: false,
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

    passport.use(strategy);
    passport.use('local', localStrategy);

    app.use(passport.initialize());
    app.use(passport.session());
    return {
        status: '✅',
        message: 'Passport config successfully'
    }
}
