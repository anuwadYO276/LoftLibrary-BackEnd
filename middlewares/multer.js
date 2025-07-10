import multer from "multer";
import path from "path";
import fs from "fs";

// กำหนด path uploads แบบ absolute
const uploadDir = path.resolve(process.cwd(), "uploads");

// สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ตั้งค่าการเก็บไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // ใช้ path absolute
  },
  filename: (req, file, cb) => {
    const authorId = req.body.author_id || "unknown";
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "");
    const ext = path.extname(file.originalname);
    const filename = `${authorId}_${timestamp}${ext}`;
    cb(null, filename);
  }
});

// กรองเฉพาะ .jpg, .png
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg and .png files are allowed"));
  }
};

// สร้างและ export multer instance
export const upload = multer({ storage, fileFilter });
