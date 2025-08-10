import express from "express"
const router = express.Router()
import { 
     getTransactionBookHistoryPurchase
     , getTransactionEpisodeHistoryPurchase
     , updateFavorites
     , getUserFavorites
} from "../controller/user.js"

router.post("/book", getTransactionBookHistoryPurchase);
router.post("/episode", getTransactionEpisodeHistoryPurchase);
router.post("/favorites", updateFavorites);
router.get("/", getUserFavorites)
export default router