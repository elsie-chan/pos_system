import express from "express";

const router = express.Router();

router.get("/404", (req, res) => {
    res.render('error/404', {title: '404'})
})

router.get("/500", (req, res) => {
    res.render('error/500', {title: '500'})
})

router.get("/403", (req, res) => {
    res.render('error/403', {title: '403'})
})

export default router;