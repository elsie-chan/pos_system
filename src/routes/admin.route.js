import express from "express";

const router = express.Router();

router.get("/dashboard", ( req, res ) => {
    res.render('layouts/admin/dashboard', {title: 'Dashboard'});
})

export default router;