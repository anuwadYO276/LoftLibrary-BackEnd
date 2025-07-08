import express from "express"
const router = express.Router()
import { 
    signupReader
    ,signupWriter
    , login 
    , signupReaderGoogle
    , signupReaderFacebook
    , signupWriterGoogle
    , signupWriterFacebook
    , loginSocialUser
    , forgotPassword
    , resetPassword
    , updateUserProfile
} from "../controller/auth.js"

router.post("/signup/reader", signupReader)
router.post("/signup/writer", signupWriter)
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.post("/signup/reader_google", signupReaderGoogle)
router.post("/signup/reader_facebook", signupReaderFacebook)
router.post("/signup/writer_google", signupWriterGoogle)
router.post("/signup/writer_facebook", signupWriterFacebook)
router.post("/login/social", loginSocialUser)
router.post("/update-profile", updateUserProfile)

export default router