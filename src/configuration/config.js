import express from 'express';
import morgan from 'morgan';
import ejs from 'ejs';
import {fileURLToPath} from 'url';
import * as path from 'path';
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import cors from "cors";

const config = (app) => {
    app.engine('ejs', ejs.renderFile);
    app.set('view engine', 'ejs');
    app.use(cors({ origin: '*' }));

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());

    app.use(flash())
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename).slice(0, -13)
    app.use(express.static(path.join(__dirname, 'public')))
    app.set('views', path.join(__dirname, 'views'))

    app.use('/favicon.ico', express.static('./src/public/favicon.ico'));
    app.use(morgan('combined'));

    return {
        status: '✅',
        message: 'Resource config loaded'
    }
}

export default config;
