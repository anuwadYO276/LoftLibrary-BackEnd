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

router.post("/reader", signupReader)
router.post("/writer", signupWriter)
router.post("/reader_google", signupReaderGoogle)
router.post("/reader_facebook", signupReaderFacebook)
router.post("/writer_google", signupWriterGoogle)
router.post("/writer_facebook", signupWriterFacebook)

export default router