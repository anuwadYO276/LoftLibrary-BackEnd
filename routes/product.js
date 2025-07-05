import express from "express"
const router = express.Router()
import { CreateProduct, getProduct, searchProduct } from "../controller/product.js"

router.post("/product", CreateProduct)
router.get("/product/:count", getProduct)
router.post("/product/search", searchProduct)

export default router