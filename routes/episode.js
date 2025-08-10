import express from "express"
const router = express.Router()

import { getEpisodeProduct
        , getEpisodeID
        , CreateEpisode
        , UpdateEpisode
    } from "../controller/episode.js"
import { upload } from "../middlewares/multer.js" // 👈 import multer middleware

router.get("/:BookId", getEpisodeProduct)
router.get("/:BookId/:EpisodeId", getEpisodeID)
router.post('/', upload.fields([{ name: 'cover', maxCount: 1 }]), CreateEpisode)
router.put('/:EpisodeId', upload.fields([{ name: 'cover', maxCount: 1 }]), UpdateEpisode)
export default router
