import express from "express"
const router = express.Router()
import { CreateProduct, getProductID, searchProduct,getProduct } from "../controller/product.js"

router.get("/product", getProduct)
router.get("/product/:count", getProductID)
router.post("/product/search", searchProduct)

router.post("/product", CreateProduct)

export default router