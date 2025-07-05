import express from "express"
const router = express.Router()
import { signupReader,signupWriter, login } from "../controller/auth.js"

router.post("/signup/reader", signupReader)
router.post("/signup/writer", signupWriter)
router.post("/login", login)

export default router