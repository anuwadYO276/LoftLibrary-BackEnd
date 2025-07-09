import express from "express"
const router = express.Router()
import { 
    signupReader
    ,signupWriter
    , signupReaderGoogle
    , signupReaderFacebook
    , signupWriterGoogle
    , signupWriterFacebook
} from "../controller/auth.js"

router.post("/signup/reader", signupReader)
router.post("/signup/writer", signupWriter)
router.post("/signup/reader_google", signupReaderGoogle)
router.post("/signup/reader_facebook", signupReaderFacebook)
router.post("/signup/writer_google", signupWriterGoogle)
router.post("/signup/writer_facebook", signupWriterFacebook)

export default router