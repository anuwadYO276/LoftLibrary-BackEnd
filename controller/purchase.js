import db from "../lib/db.js"
import constantPurchase from "../lib/constantPurchase.js"
import constantCoins from "../lib/constantCoins.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import logger from '../utils/logger.js';
import ApiResponse from '../utils/response.js';


export const purchasesEpisode = async (req, res) => {
  try {
    const { userId, bookId, episodeId, amount } = req.body;
    if (!userId || !bookId || !episodeId || !amount) {
      return ApiResponse.error(res, 'User ID, Book ID, Episode ID and amount are required', 400, 'error');
    }
    const [rows] = await db.query(constantCoins.getTransactionHistory, [userId]);
    const totalCoins = rows.reduce((acc, transaction) => acc + transaction.amount, 0);
    if (totalCoins < amount) {
      return ApiResponse.error(res, 'Insufficient coins', 400, 'error');
    }

    // Insert purchase record
    await db.query(constantPurchase.addPurchase, [userId, bookId, episodeId, amount]);
    return ApiResponse.success(res, null, 200, 'Purchase successful');


  } catch (err) {
    logger.error(`❌ Failed to purchase episode: ${err.message}`);
    return ApiResponse.error(res, 'Server error', 500, 'error');
  }
}
