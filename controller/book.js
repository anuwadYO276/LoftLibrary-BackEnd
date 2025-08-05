import db from "../lib/db.js"
import constantBook from "../lib/constantBook.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import logger from '../utils/logger.js';
import ApiResponse from '../utils/response.js';
export const addRate = async (req, res) => {
  try {
    const { bookId, userId, rating, comment } = req.body;
    if (!bookId || !userId || !rating) {
      return ApiResponse.error(res, 'Book ID, User ID and Rating are required', 400, 'error');
    }
    const [existing] = await db.query(constantBook.getRatingQuery, [bookId, userId]);
    
    if (existing.length > 0) {
      // delete existing rating
        await db.query(constantBook.deleteRatingQuery, [bookId, userId]);
    }
    
    await db.query(constantBook.addRatingQuery, [bookId, userId, rating, comment]);
    return ApiResponse.success(res, { message: 'Rating added successfully' }, 200, 'success');
  } catch (err) {
    logger.error(`❌ Failed to add rating: ${err.message}`);
    return ApiResponse.error(res, 'Server error', 500, 'error');
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return ApiResponse.error(res, 'Search query is required', 400, 'error');
    }
    const searchKey = `%${query.toLowerCase()}%`;
    const [rows] = await db.query(constantBook.searchBooksQuery, [searchKey]);
    if (rows.length === 0) {
      return ApiResponse.error(res, 'No books found', 404, 'error');
    }
    
    return ApiResponse.success(res, rows, 200, 'Books retrieved successfully');
  } catch (err) {
    logger.error(`❌ Failed to search books: ${err.message}`);
    return ApiResponse.error(res, 'Server error', 500, 'error');
  }
};

export const updateBooks = async (req, res) => {
  try {
    const { bookId, title, userId, description } = req.body;

    if (!title || !userId || !description) {
      return ApiResponse.error(res, 'Title, User ID and Description are required', 400, 'error');
    }

    const booksFile = req.files?.books?.[0];

    if (bookId) {
      // ✏️ กรณีแก้ไขหนังสือ
      let books;

      if (booksFile) {
        books = booksFile.filename;
      } else {
        // ดึงชื่อไฟล์เดิมจากฐานข้อมูล
        const [existing] = await db.query('SELECT cover_image FROM books WHERE id = ?', [bookId]);

        if (existing.length === 0) {
          return ApiResponse.error(res, 'Book not found', 404, 'error');
        }

        books = existing[0].cover_image;
      }

      await db.query(constantBook.updateBookQuery, [title, userId, description, books, bookId]);
      return ApiResponse.success(res, { message: 'Book updated successfully' }, 200, 'success');
    } else {
      // ➕ กรณีเพิ่มหนังสือใหม่
      const books = booksFile ? booksFile.filename : null;
      await db.query(constantBook.addBookQuery, [title, userId, description, books]);
      return ApiResponse.success(res, { message: 'Book added successfully' }, 201, 'success');
    }
  } catch (err) {
    logger.error(`❌ Failed to update book: ${err.message}`);
    return ApiResponse.error(res, 'Server error', 500, 'error');
  }
};

export const getBookMy = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return ApiResponse.error(res, 'User ID is required', 400, 'error');
    }
    const [rows] = await db.query(constantBook.getBooksQuery, [userId]);
    if (rows.length === 0) {
      return ApiResponse.error(res, 'No books found for this user', 404, 'error');
    }
    
    return ApiResponse.success(res, rows, 200, 'Books retrieved successfully');
  } catch (err) {
    logger.error(`❌ Failed to get user books: ${err.message}`);
    return ApiResponse.error(res, 'Server error', 500, 'error');
  }
};

export const updateBookComplete = async (req, res) => {
  try {
    const { bookId, isComplete } = req.body;
    if (!bookId || isComplete === undefined) {
      return ApiResponse.error(res, 'Book ID and completion status are required', 400, 'error');
    }
    await db.query(constantBook.updateBookCompleteQuery, [isComplete, bookId]);
    return ApiResponse.success(res, { message: 'Book completion status updated successfully' }, 200, 'success');
  } catch (err) {
    logger.error(`❌ Failed to update book completion status: ${err.message}`);
    return ApiResponse.error(res, 'Server error', 500, 'error');
  }
};