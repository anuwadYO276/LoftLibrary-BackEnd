import db from "../lib/db.js"
import constantEpisode from "../lib/constantEpisode.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import logger from '../utils/logger.js';
import ApiResponse from '../utils/response.js';

// CREATE TABLE episodes (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   book_id INT,
//   user_id INT,
//   title VARCHAR(255),
//   content TEXT,
//   is_free BOOLEAN DEFAULT FALSE,
//   price INT DEFAULT 1,
//   episodes_image VARCHAR(255),
//   release_date DATE,
//   status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
export const getEpisodeProduct = async (req, res) => {
    try {
        const { BookId } = req.params;
        const [rows] = await db.query(constantEpisode.getEpisodeByBookIdQuery, [BookId]);
        return ApiResponse.success(res, rows, 200, 'Episodes retrieved successfully');
    } catch (error) {
        logger.error("Error fetching episodes:", error);
        return ApiResponse.error(res, "Failed to fetch episodes", 500, 'error');
    }
}

export const getEpisodeID = async (req, res) => {
    try {
        const { BookId, EpisodeId } = req.params;
        const [rows] = await db.query(constantEpisode.getEpisodeByIdQuery, [BookId, EpisodeId]);
        if (rows.length === 0) {
            return ApiResponse.error(res, "Episode not found", 404, 'error');
        }
        return ApiResponse.success(res, rows[0], 200, 'Episode retrieved successfully');
    } catch (error) {
        logger.error("Error fetching episode by ID:", error);
        return ApiResponse.error(res, "Failed to fetch episode", 500, 'error');
    }
}
export const CreateEpisode = async (req, res) => {
  try {
    // ดึงข้อมูลจาก body
    const { book_id, user_id, title, content, is_free, price, release_date, status } = req.body;

    if (!book_id || !user_id || !title || !content) {
      return ApiResponse.error(res, "Book ID, User ID, Title, and Content are required", 400, 'error');
    }
    // ดึงไฟล์ cover จาก req.files (ถ้ามี)
    const coverFile = req.files?.cover?.[0];

    // ถ้าไม่มีไฟล์ cover ส่ง error กลับ
    if (!coverFile) {
      return ApiResponse.error(res, "Cover file is required", 400, 'error');
    }

    // ตั้งชื่อไฟล์ cover ที่จะใช้เก็บในฐานข้อมูล
    const cover = coverFile.filename;

    // เตรียม query และค่าที่จะใส่
    const query = constantEpisode.addEpisodeQuery;
    const values = [
      book_id,
      user_id,
      title,
      content,
      is_free ? 1 : 0,
      price || 0,
      cover,
      release_date,
      status || 'draft'
    ];
    // รัน query insert
    const [result] = await db.query(query, values);

    // ส่ง response สำเร็จพร้อม id ที่สร้าง
    return ApiResponse.success(res, { id: result.insertId, message: "Episode created successfully" }, 201, 'success');
  } catch (error) {
    logger.error("Error creating episode:", error);
    return ApiResponse.error(res, "Failed to create episode", 500, 'error');
  }
}


export const UpdateEpisode = async (req, res) => {
    try {
        const { EpisodeId } = req.params;
        const { title, description } = req.body;
        const episodeFile = req.files?.['cover']?.[0];

        let episodes;

        if (episodeFile) {
            // ถ้ามีไฟล์แนบมา ใช้ไฟล์ใหม่
            episodes = episodeFile.filename;
        } else {
            // ถ้าไม่มีไฟล์แนบมา ดึงชื่อไฟล์เดิมจากฐานข้อมูล
            const [existing] = await db.query('SELECT episodes_image FROM episodes WHERE id = ?', [EpisodeId]);

            if (existing.length === 0) {
                return ApiResponse.error(res, "Episode not found", 404, 'error');
            }

            episodes = existing[0].episodes_image;
        }

        const query = constantEpisode.updateEpisodeQuery;
        const values = [title, description, episodes, EpisodeId];
        await db.query(query, values);

        return ApiResponse.success(res, { message: "Episode updated successfully" }, 200, 'success');
    } catch (error) {
        logger.error("Error updating episode:", error);
        return ApiResponse.error(res, "Failed to update episode", 500, 'error');
    }
};

