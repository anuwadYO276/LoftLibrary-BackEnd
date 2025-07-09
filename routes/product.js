import express from "express"
const router = express.Router()
import { CreateProduct, getProductID, searchProduct,getProduct } from "../controller/product.js"

router.get("/", getProduct)
router.get("/:count", getProductID)
router.post("/search", searchProduct)

router.post("/", CreateProduct)

export default router