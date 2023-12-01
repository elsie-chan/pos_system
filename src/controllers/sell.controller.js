class SellController {
    async addProductToSession(req, res) {
        try {
            const products = req.body;
            req.session.products = req.session?.products || [];
            // console.log(products);
            products.forEach(product => {
                const productExist = req.session.products.find(p => p.product._id === product._id);
                if (productExist) {
                    productExist.quantity += 1;
                } else {
                    req.session.products.push({
                        product,
                        quantity: 1,
                    });
                }
            })
            req.session.save();
            console.log(req.session);
            return res.status(200).json({message: "Add product to session successfully"});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: e.message});
        }
    }

    async deleteProduct(req, res) {
        try {
            const {id} = req.params;
            req.session.products = req.session.products.filter(product => product._id !== id);
            req.session.save();
            return res.status(200).json({message: "Delete product successfully"});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: e.message});
        }
    }

    async updateQuantity(req, res) {
        try {
            const {id} = req.params;
            const {quantity} = req.body;
            req.session.products.forEach(product => {
                if (product._id === id) {
                    product.quantity = quantity;
                }
            })
            req.session.save();
            return res.status(200).json({message: "Update quantity successfully"});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: e.message});
        }
    }
}

export default new SellController();