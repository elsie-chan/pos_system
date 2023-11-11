import Product from "../models/product.model.js";
import { ErrorMessage } from "../errors/index.js";
import {InvoiceService} from "./index.js";

const getAll = async () => {
    try {
        const products = Product.find({});
        return await products;
    } catch (e) {
        return ErrorMessage(400, "Product not found");
    }

}
const getById = async (id) => {
    try {
        const product = Product.findById(id);
        return await product;
    } catch (e) {
        return ErrorMessage(400, "Product not found");
    }
}
const create = async (data, files) => {
    try {
        if (!files) {
            return ErrorMessage(400, "File not found");
        }
        files = files[0];
        const product = new Product(
            {
                name: data.name,
                importPrice: data.importPrice,
                retailPrice: data.retailPrice,
                category: data.category,
                image: files.filename
            }
        );
        return await product.save();
    } catch(e) {
        console.log(e)
        return ErrorMessage(400, "Product not found");
    }

}
const update = async (id, data, files) => {
    try {
        if (!files) {
            return ErrorMessage(400, "File not found");
        }
        files = files[0];
        data.image = files.filename;

        const product = await Product.findByIdAndUpdate(id,data);
        console.log(product)
        if (!product) {
            return null;
        }
        return product;
    } catch(e) {
        console.log(e)
        return ErrorMessage(400, "Product not found");
    }

}
const deleteProduct = async (id) => {
    try {
        const product = await Product.findById({
            _id: id
        })
        const existProduct = await InvoiceService.findExistProduct(id)
        if (existProduct) {
            return ErrorMessage(400, "Product is exist in invoice");
        }
        if (!product) {
            return ErrorMessage(400, "Product not found");
        }
        return "Delete product successfully";
    } catch (e) {
        return ErrorMessage(400, "Product not found");
    }
}

export default { getAll , getById, create, update, deleteProduct };

