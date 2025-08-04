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
        const { book_id, title, description } = req.body;
        const episodeFile = req.files['episodes'][0];

        if (!episodeFile) {
            return ApiResponse.error(res, "Episode file is required", 400, 'error');
        }

        const episodesFile = req.files?.episodes?.[0];
        const episodes = episodesFile ? episodesFile.filename : user[0].episodes;

        const query = constantEpisode.addEpisodeQuery;
        const values = [book_id, title, description, episodes.filename];
        const [result] = await db.query(query, values);

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
        const episodeFile = req.files['episodes'] ? req.files['episodes'][0] : null;

        if (!episodeFile) {
            return ApiResponse.error(res, "Episode file is required", 400, 'error');
        }

        const episodesFile = req.files?.episodes?.[0];
        const episodes = episodesFile ? episodesFile.filename : user[0].episodes;
        
        const query = constantEpisode.updateEpisodeQuery;
        const values = [title, description, episodes.filename, EpisodeId];
        await db.query(query, values);

        return ApiResponse.success(res, { message: "Episode updated successfully" }, 200, 'success');
    } catch (error) {
        logger.error("Error updating episode:", error);
        return ApiResponse.error(res, "Failed to update episode", 500, 'error');
    }
}

