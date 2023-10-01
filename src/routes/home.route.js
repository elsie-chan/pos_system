import express from "express";

const router = express.Router();

router.get("/", ( req, res ) => {
    res.render('layouts/home', {title: 'Home'})
});

export default router;