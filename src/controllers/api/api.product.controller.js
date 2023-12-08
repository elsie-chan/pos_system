import {ProductService} from '../../services/index.js'
import {paginate} from "../../utils/index.js";
class ApiProductController {
    async getAll(req, res) {
        try {
            const page = req.query.page || 1
            const products =  await ProductService.getAll()
            return paginate(products, page, 10)
        } catch (e) {
            req.flash('error', e.message)
        }
    }
    async getById(req, res) {
        const { id } = req.params;
        try {
            const product = await ProductService.getById(id);
            return res.status(200).json(product)
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }
    async create(req, res) {
        try {
            console.log(req.body, req.files)
            const newProduct = await ProductService.create(req.body, req.files);
            console.log(newProduct)
            return res.status(200).json({ message: 'Create product successfully'})
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }
    async update(req, res) {
        const { id } = req.params;
        try {
            await ProductService.update(id, req.body, req.files);
            return res.status(200).json({ message: 'Update product successfully'})
        } catch(e){
            return res.status(500).json({ message: e.message })
        }
    }
    async delete(req, res) {
        const { id } = req.params;
        try {
            const product = await ProductService.deleteProduct(id);
            switch (product.status) {
                case 400: return res.status(400).json({ message: product.message })
                case 500: return res.status(500).json({ message: product.message })
                default: return res.status(200).json({ message: product })
            }
        } catch(e){
            return res.status(500).json({ message: e.message })
        }
    }

    async findProduct(req, res) {
        const {name} = req.body;
        console.log(name)
        try {
            const product = await ProductService.findProduct(name);
            return res.status(200).json(product)
        } catch (e) {
            return res.status(500).json({ message: e.message })
        }
    }
}


export default new ApiProductController()