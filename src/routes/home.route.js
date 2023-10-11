import express from "express";
import {configUpload} from "../configuration/index.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render('layouts/home', {title: 'Home'})
});

router.get("/upload", configUpload('products').array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})

export default router;