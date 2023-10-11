import mongoose from "mongoose";
import {Roles} from "../constants/roles.js";
import {ErrorMessage} from "../errors/index.js";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    importPrice: {
        type: Number,
        require: true
    },
    retailPrice: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    }
}, {timestamps: true})

const Product = mongoose.model('Product', productSchema);

export default Product;

export const findProduct = async (id, role) => {
   try {
       const product = await Product.findById({
           _id: id,
       });
       if (role === Roles.ADMIN) {
           return product;
       } else {
           return product.select("-importPrice");
       }
   } catch (e) {
       console.log(e)
       return ErrorMessage(400, "Product not found");
   }
}