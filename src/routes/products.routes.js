import { Router } from "express";
import { createProduct, getAllProducts, getProductById, updateProductById, deleteProductById } from "../controllers/products.controller";
import { verifyToken, isAdmin } from "../middlewares";

const router = Router();

router.post('/', [verifyToken, isAdmin], createProduct);
router.get('/', getAllProducts);
router.get('/:productId', getProductById);
router.put('/:productId', [verifyToken, isAdmin], updateProductById);
router.delete('/:productId', [verifyToken, isAdmin], deleteProductById);

export default router;