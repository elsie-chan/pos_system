class SellController {
    async addProductToSession(req, res) {
        try {
            const product = req.body;
            req.session.products = req.session?.products || [];
            product.forEach(product => {
                const existProduct = req.session.products.find(item => item._id === product._id);
                if (existProduct) {
                    existProduct.quantity += product.quantity;
                } else {
                    req.session.products.push(product);
                }
            })
            req.session.save();
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

        }
    }
    
    async updateQuantity(req, res) {
        try {

        } catch (e) {
            
        }
    }
}

export default new SellController();