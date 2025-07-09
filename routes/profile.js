import express from "express"
const router = express.Router()
import { 
     updateUserProfile
} from "../controller/auth.js"

router.post("/update-profile", updateUserProfile)

export default router