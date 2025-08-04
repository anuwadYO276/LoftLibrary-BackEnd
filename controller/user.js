import db from "../lib/db.js"
import constantUser from "../lib/constantUser.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import logger from '../utils/logger.js';
import ApiResponse from '../utils/response.js';

export const getTransactionBookHistoryPurchase = async (req, res) => {
  try {
    const { userId} = req.body;
    if (!userId) {
      return ApiResponse.error(res, 'User ID is required', 400, 'error');
    }
    const [rows] = await db.query(constantUser.getTransactionBookHistory, [userId]);
    if (rows.length === 0) {
      return ApiResponse.error(res, 'No purchase history found', 404, 'error');
    }
    return ApiResponse.success(res, rows, 200, 'Purchase history retrieved successfully');
  } catch (err) {
    logger.error(`❌ Failed to get book purchase history: ${err.message}`);
    return ApiResponse.error(res, 'Server error', 500, 'error');
  }
}

export const getTransactionEpisodeHistoryPurchase = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    if (!userId || !bookId) {
      return ApiResponse.error(res, 'User ID and Book ID are required', 400, 'error');
    }
    const [rows] = await db.query(constantUser.getTransactionEpisodeHistory, [userId, bookId]);
    if (rows.length === 0) {
      return ApiResponse.error(res, 'No episode purchase history found', 404, 'error');
    }
    return ApiResponse.success(res, rows, 200, 'Episode purchase history retrieved successfully');
  } catch (err) {
    logger.error(`❌ Failed to get episode purchase history: ${err.message}`);
    return ApiResponse.error(res, 'Server error', 500, 'error');
  }
}

export const updateFavorites = async (req, res) => {
  try {
    const { userId, bookId } = req.body;
    if (!userId || !bookId) {
      return ApiResponse.error(res, 'User ID and Book ID are required', 400, 'error');
    }
    
    // Check if the book is already in favorites
    const [existing] = await db.query(constantUser.getFavoritesQuery, [userId, bookId]);
    
    if (existing.length > 0) {
      await db.query(constantUser.deleteFavoriteQuery, [userId, bookId]);
      return ApiResponse.success(res, { message: 'Book removed from favorites' }, 200, 'success');
    } else {
      await db.query(constantUser.addFavoriteQuery, [userId, bookId]);
      return ApiResponse.success(res, { message: 'Book added to favorites' }, 200, 'success');
    }
  } catch (err) {
    logger.error(`❌ Failed to update favorites: ${err.message}`);
    return ApiResponse.error(res, 'Server error', 500, 'error');
  }
}

export const getUserFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return ApiResponse.error(res, 'User ID is required', 400, 'error');
    }
    
    const [rows] = await db.query(constantUser.getUserFavorites, [id]);
    if (rows.length === 0) {
      return ApiResponse.error(res, 'No favorites found', 404, 'error');
    }
    
    return ApiResponse.success(res, rows, 200, 'Favorites retrieved successfully');
  } catch (err) {
    logger.error(`❌ Failed to get user favorites: ${err.message}`);
    return ApiResponse.error(res, 'Server error', 500, 'error');
  }
}