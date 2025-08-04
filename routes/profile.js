import express from "express"
const router = express.Router()
import { 
    setNickname,
    updateProfile,
    getUserProfile
} from "../controller/profile.js"

router.post("/nickname", setNickname);
router.put("/", updateProfile);
router.get("/", getUserProfile);

export default router