import express from "express";
import ApiProductController from "../../controllers/api/api.product.controller.js";
import validation from "../../validator/validation.route.js";
import {configUpload} from "../../configuration/index.js";

const router = express.Router();

router.get("/get_all", validation, ApiProductController.getAll.bind(ApiProductController));
router.get("/get/:id", validation, ApiProductController.getById.bind(ApiProductController));
router.post("/create", validation, configUpload('products').array('image', 12), ApiProductController.create.bind(ApiProductController));
router.put("/update/:id", validation, ApiProductController.update.bind(ApiProductController));
router.delete("/delete/:id", validation, ApiProductController.delete.bind(ApiProductController));
export default router;