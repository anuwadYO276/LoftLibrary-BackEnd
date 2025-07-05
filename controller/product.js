import db from "../lib/db.js"
import constant from "../lib/constant.js"

export const CreateProduct = async (req, res) => {
    try {
        const { book_name, description, reader_id, writer_id, category_id } = req.body
        if (!book_name || !description) {
            return res.status(400).json({ message: "Name and description are required" });
        }

        const [product] = await db.query(constant.CreateProduct, [book_name, description, reader_id, writer_id, category_id]);
        if (product.affectedRows === 0) {
            return res.status(500).json({ message: "Failed to create product" });
        }
        return res.status(201).json({ message: "add book success"});

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

export const getProduct = async (req, res) => {
    try {
        const { count } = req.params;
        if (!count || isNaN(count)) {
            return res.status(400).json({ message: "Invalid count parameter" });
        }

        const [products] = await db.query(constant.getProduct, [parseInt(count)]);
        res.status(200).json(products);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

export const searchProduct = async (req, res) => {
    try {
        const { key } = req.body;
        if (!key) {
            return res.status(400).json({ message: "Search key is required" });
        }

        const searchKey = `%${key}%`;
        const [products] = await db.query(constant.searchProduct, [searchKey, searchKey]);
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        return res.status(200).json(products);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}
