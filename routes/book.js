import express from "express"
const router = express.Router()

import { addRate
        , searchBooks
        , updateBooks
        , getBookMy
        , updateBookComplete
    } from "../controller/book.js"
import { upload } from "../middlewares/multer.js" // 👈 import multer middleware

router.post("/rate", addRate)
router.get("/", searchBooks)
router.post('/', upload.fields([{ name: 'books', maxCount: 1 }]), updateBooks)
router.post("/book-My", getBookMy)
router.post("/is_complete", updateBookComplete)

export default router
