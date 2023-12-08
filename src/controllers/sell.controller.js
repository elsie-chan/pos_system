import Product from "../models/product.model.js";

class SellController {
    async addProductToSession(req, res) {
        try {
            const id = req.params.id;
            const product = await Product.findById(id);
            if (!product) {
                return res.status(500).json({message: "Incorrect barcode"});
            }
            const products = req.cookies.products || [];
            console.log(products);
            const productInCookie = products.find(product => product.id === id);
            if (productInCookie) {
                productInCookie.quantity = +productInCookie.quantity + 1;
            } else {
                // delete product.quantity in product object
                delete product.quantity;
                products.push({id, quantity: 1, information: product});
            }

            const totalPrice = products.reduce((total, productEntity) => {
                return total + productEntity.quantity * productEntity.information.retailPrice;
            }, 0);

            delete product.quantity;
            res.cookie('products', products);
            return res.status(200).json({products, total: totalPrice});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: e.message});
        }
    }

    async deleteProduct(req, res) {
        try {
            const {id} = req.params;
            console.log("hehehe: ",id)
            const products = req.cookies.products || [];
            const productNotDelete = products.filter(product => product.id !== id);

            const totalPrice = productNotDelete.reduce((total, productEntity) => {
                return total + productEntity.quantity * productEntity.information.retailPrice;
            }, 0);

            res.cookie('products', productNotDelete);
            return res.status(200).json({products: productNotDelete, total: totalPrice});
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: e.message});
        }
    }

    async updateQuantity(req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            console.log(quantity, id);

            const products = req.cookies.products || [];

            const updatedProducts = products.map(product => {
                if (product.id === id) {
                    return { ...product, quantity: quantity }; // Update the quantity
                }
                return product;
            });

            const totalPrice = updatedProducts.reduce((total, productEntity) => {
                return total + productEntity.quantity * productEntity.information.retailPrice;
            }, 0);

            res.cookie('products', updatedProducts);

            return res.status(200).json({ products: updatedProducts, total: totalPrice });
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: e.message });
        }
    }

}

export default new SellController();