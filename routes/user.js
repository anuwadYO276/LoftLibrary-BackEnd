import express from "express"
const router = express.Router()
import { 
     getTransactionBookHistoryPurchase
     , getTransactionEpisodeHistoryPurchase
     , updateFavorites
     , getUserFavorites
     , getUserHistory
     , addUserUpdateHistory
     , getTransactionBookPurchase
     , getAudio
} from "../controller/user.js"

router.post("/book", getTransactionBookHistoryPurchase);
router.post("/episode-history", getTransactionEpisodeHistoryPurchase);
router.post("/favorites", updateFavorites);
router.get("/", getUserFavorites)
router.post("/history", getUserHistory)
router.post("/update-history", addUserUpdateHistory)

router.post("/get-data-purchases-all", getTransactionBookPurchase);

router.post("/audio", getAudio);


export default router