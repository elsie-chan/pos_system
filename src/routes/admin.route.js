import express from "express";

const router = express.Router();

router.get("/dashboard", ( req, res ) => {
    res.render('layouts/admin/dashboard', {title: 'Dashboard'});
})
router.get("/product", ( req, res ) => {
    res.render('layouts/admin/product', {title: 'Product'});
})

export default router;