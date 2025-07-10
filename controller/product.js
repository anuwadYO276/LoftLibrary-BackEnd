import db from "../lib/db.js";
import constantBook  from "../lib/constant_book.js";
import logger from '../utils/logger.js';
import e from "express";


export const CreateProduct = async (req, res) => {
  try {
    const file = req.file;
    const cover_url = file ? `/uploads/${file.filename}` : null;

    let {
      title,
      description,
      category,
      author_id,
      price_per_chapter,
      release_date,
      status
    } = req.body;

    if (!title || !description || !author_id || !release_date) {
      logger.error("❌ Title, description, author ID, and release date are required");
      return res.status(400).json({
        statusCode: 400,
        message: "Title, description, author ID, and release date are required"
      });
    }

    status = status || 'draft';

    const [product] = await db.query(constantBook.CreateProduct, [
      title,
      description,
      cover_url,
      category,
      author_id,
      price_per_chapter,
      release_date,
      status,
    ]);

    if (product.affectedRows === 0) {
      logger.error(`❌ Failed to create book "${title}" by author_id ${author_id}`);
      return res.status(500).json({
        statusCode: 500,
        message: "Failed to create product"
      });
    }

    logger.info(`✅ product.insertId ${product.insertId} created successfully with cover_url ${cover_url}`);

    return res.status(201).json({
      statusCode: 200,
      message: "Product created successfully",
      data: {
        id: product.insertId,
        cover_url
      }
    });

  } catch (err) {
    logger.error(`❌ Failed to create book "${req.body.title}" by author_id ${req.body.author_id}: ${err.message}`);
    return res.status(500).json({
      statusCode: 500,
      message: "Server error",
      data: err.message
    });
  }
};



export const UpdateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      title,
      description,
      category,
      author_id,
      price_per_chapter,
      release_date,
      status,
    } = req.body;

    const file = req.file;
    const cover_url = file ? `/uploads/${file.filename}` : null;

    if (!title || !description || !author_id || !price_per_chapter || !release_date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // เตรียม params สำหรับ query แบบเดียวกันเสมอ
    // แต่ถ้า cover_url เป็น null, จะส่งเป็นค่าเดิม (ใน SQL ต้องรองรับ)
    const params = [
      title,
      description,
      cover_url,       // ถ้า null หมายถึงไม่เปลี่ยน หรือใน SQL ต้องจัดการ
      category,
      author_id,
      price_per_chapter,
      release_date,
      status,
      productId,
    ];

    // สมมติ SQL Update ใน constantBook.UpdateProduct รองรับกรณี cover_url อาจเป็น null
    const [result] = await db.query(constantBook.UpdateProduct, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found or no changes" });
    }

    return res.json({ message: "Product updated successfully" });

  } catch (error) {
    logger.error(`❌ Failed to update product ID ${req.params.id}: ${error.message}`);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProductID = async (req, res) => {
  try {
    const { count } = req.params;
    if (!count || isNaN(count)) {
      return res.status(400).json({ message: "Invalid count parameter" });
    }
    const [products] = await db.query(constantBook.getProductID, [parseInt(count)]);
    logger.info(`✅ Fetched product with ID ${count}`);
    res.status(200).json(products);
  } catch (err) {
    logger.error(`❌ Failed to fetch product with ID ${req.params.count}: ${err.message}`);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { count } = req.query;
    const limit = count ? parseInt(count) : 10; // default 10
    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: "Invalid count parameter" });
    }
    const [products] = await db.query(constantBook.getProduct, [limit]);
    logger.info(`✅ Fetched ${products.length} products`);
    return res.status(200).json(products);
  } catch (err) {
    logger.error(`❌ Failed to fetch products: ${err.message}`);
    return res.status(500).json({ message: "Server error" });
  }
};

export const searchProduct = async (req, res) => {
  try {
    const { key } = req.body;
    if (!key) {
      logger.error("❌ Search key is required");
      return res.status(400).json({ message: "Search key is required" });
    }
    const searchKey = `%${key.toLowerCase()}%`;
    const [products] = await db.query(constantBook.searchProduct, [searchKey, searchKey]);
    if (products.length === 0) {
      logger.info(`✅ No products found for search key "${key}"`);
      return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json(products);
  } catch (err) {
    logger.error(`❌ Failed to search products: ${err.message}`);
    return res.status(500).json({ message: "Server error" });
  }
};
