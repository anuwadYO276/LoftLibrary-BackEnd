import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT || 4000,
  ssl: {
    minVersion: "TLSv1.2",   // บังคับ TLS >= 1.2
    rejectUnauthorized: true // ตรวจสอบ cert ของ server
  }
});

// test connection
db.getConnection()
  .then((conn) => {
    console.log("✅ Database connected");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed");
    console.error(err);
  });

export default db;
