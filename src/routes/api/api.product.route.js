import express from "express";
import ApiProductController from "../../controllers/api/api.product.controller.js";
import validation from "../../validator/validation.route.js";
import {configUpload} from "../../configuration/index.js";

const router = express.Router();

router.get("/getAllProducts", validation, ApiProductController.getAll.bind(ApiProductController));
router.get("/:id", validation, ApiProductController.getById.bind(ApiProductController));
router.post("/createProduct", validation, configUpload('products').array('image', 12), ApiProductController.create.bind(ApiProductController));
router.put("/updateProduct/:id", validation, ApiProductController.update.bind(ApiProductController));
router.delete("/deleteProduct/:id", validation, ApiProductController.delete.bind(ApiProductController));
export default router;