import db from "../lib/db.js"
import constant from "../lib/constant.js"
import logger from '../utils/logger.js';

export const CreateProduct = async (req, res) => {
    try {
        let { title, description, cover_url, category, author_id, price_per_chapter, release_date,status } = req.body;
        if (!title || !description || !author_id || !price_per_chapter || !release_date) {
            logger.error("❌ Title, description, author ID, price per chapter, and release date are required");
            return res.status(400).json({ message: "Title, description, author ID, price per chapter, and release date are required" });
        }
        status = status || 'draft'; 
        const [product] = await db.query(constant.CreateProduct, [title, description, cover_url, category, author_id, price_per_chapter, release_date, status]);
        if (product.affectedRows === 0) {
            logger.error(`❌ Failed to create book "${title}" by author_id ${author_id}`);
            return res.status(500).json({ message: "Failed to create product" });
        }
        logger.info(`✅ Created book "${title}" by author_id ${author_id}`);
        return res.status(201).json({ message: "add book success"});

    } catch (err) {
        logger.error(`❌ Failed to create book "${title}" by author_id ${author_id}: ${err.message}`);
        return res.status(500).json({ message: "Server error" });
    }
}

export const getProductID = async (req, res) => {
    try {
        const { count } = req.params;
        if (!count || isNaN(count)) {
            return res.status(400).json({ message: "Invalid count parameter" });
        }
        const [products] = await db.query(constant.getProductID, [parseInt(count)]);
        logger.info(`✅ Fetched product with ID ${count}`);
        res.status(200).json(products);
    } catch (err) {
        logger.error(`❌ Failed to fetch product with ID ${count}: ${err.message}`);
        return res.status(500).json({ message: "Server error" });
    }
}
export const getProduct = async (req, res) => {
    try {
        const { count } = req.query;
        const limit = count ? parseInt(count) : 10; // Default to 10 if no count is provided
        if (isNaN(limit) || limit <= 0) {
            return res.status(400).json({ message: "Invalid count parameter" });
        }
        const [products] = await db.query(constant.getProduct, [limit]);
        logger.info(`✅ Fetched ${products.length} products`);
        return res.status(200).json(products);
    } catch (err) {
        logger.error(`❌ Failed to fetch products: ${err.message}`);
        return res.status(500).json({ message: "Server error" });
    }
}

export const searchProduct = async (req, res) => {
    try {
        const { key } = req.body;
        if (!key) {
            logger.error("❌ Search key is required");
            return res.status(400).json({ message: "Search key is required" });
        }
        const searchKey = `%${key.toLowerCase()}%`;
        const [products] = await db.query(constant.searchProduct, [searchKey, searchKey]);
        if (products.length === 0) {
            logger.info(`✅ No products found for search key "${key}"`);
            return res.status(404).json({ message: "No products found" });
        }
        return res.status(200).json(products);
    } catch (err) {
        logger.error(`❌ Failed to search products: ${err.message}`);
        return res.status(500).json({ message: "Server error" });
    }
}
