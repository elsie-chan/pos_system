import Product from "../models/product.model.js";
import { ErrorMessage } from "../errors/index.js";
import {InvoiceService} from "./index.js";
import mongoose from "mongoose";

const getAll = async () => {
    try {
        const products = Product.find({});
        return await products;
    } catch (e) {
        return ErrorMessage(400, "Product not found");
    }

}
const getImage = async (id) => {
    try {
        const product = await Product.findById(id);
        console.log(product.image)
        return  product.image;
    } catch (e) {
        return ErrorMessage(400, "Product not found");
    }
}
const getById = async (id) => {
    try {
        console.log(id)
        const product = await Product.findById(id);
        console.log(product)
        return await product;
    } catch (e) {
        return ErrorMessage(400, "Product not found");
    }
}

const findProduct = async (name) => {
    try {
        const products = await Product.find({
            name: { $regex: new RegExp(name, 'i') }
        });

        if (!products || products.length === 0) {
            return null;
        }
        return products;
    } catch (e) {
        return ErrorMessage(400, "Product not found");
    }
};


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
        console.log(data)
        if (!files) {
            return ErrorMessage(400, "File not found");
        }
        console.log(files)
        if (files.length > 0){
            files = files[0];
            data.image = files.filename;
        } else {
            data.image = await getImage(id);
        }

        const product = await Product.findByIdAndUpdate({_id: id},{$set:data},{new:true});
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
        console.log("existProduct", existProduct)
        console.log("product", product)
        if (product == null) {
            return ErrorMessage(400, "Product not found");
        }
        if (existProduct.length > 0) {
            return ErrorMessage(400, "Product is exist in invoice");
        } else {
            await Product.deleteOne({
                _id: id
            });
            return "Delete product successfully";
        }
    } catch (e) {
        console.log(e)
        return ErrorMessage(400, "Product not found");
    }
}

export default { getAll , getById, create, update, deleteProduct, getImage, findProduct };

