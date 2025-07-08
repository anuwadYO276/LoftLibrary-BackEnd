import db from "../lib/db.js"
import constant from "../lib/constant.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import logger from '../utils/logger.js';


export const signupReader = async (req, res) => {
    try{
        const { username, email, password } = req.body
        if(!username || !email || !password){
            logger.error("❌ username, email, and password are required");
            return res.status(400).json({message: "username email and password are required"})
        }

        const [reader] = await db.query(constant.getUserByemail, [email, username])
        if(reader.length > 0){
            logger.error(`❌ User already exists: ${email}`);
            return res.status(400).json({ message: "User already exists" })
        }

        const pen_name = null
        const Userrole = "reader"
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.query(constant.insertReader, [username, email, hashedPassword, Userrole])
        logger.info(`✅ User created successfully: ${username}`);
        res.status(201).json({ message: "User create success" })

    }catch(err){
        logger.error(`❌ Failed to create user ${username}: ${err.message}`);
        res.status(500).json({message: "Server error"})
    }
};
export const signupWriter = async (req, res) => {
    try{
        const { username, email, password, pen_name } = req.body
        if(!username || !email || !password || !pen_name){
            logger.error("❌ username, email, password, and pen_name are required");
            return res.status(400).json({message: "username email password and penname are required"})
        }

        const [writer] = await db.query(constant.getUserByemail, [email, username, pen_name])
        if(writer.length > 0){
            logger.error(`❌ User already exists: ${email}`);
            return res.status(400).json({ message: "User already exists" })
        }

        const Userrole = "writer"
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.query(constant.insertWriter, [username, email, hashedPassword, pen_name, Userrole])
        logger.info(`✅ User writer created successfully: ${username}`);
        res.status(201).json({ message: "User writer create success" })

    }catch(err){
        logger.error(`❌ Failed to create user writer ${username}: ${err.message}`);
        res.status(500).json({message: "Server error"})
    }
};
export const signupReaderGoogle = async (req, res) => {
  try {
    const { username, email, provider_id, avatar_url } = req.body;

    // ตรวจสอบ input
    if (!username || !email || !provider_id) {
        logger.error("❌ username, email, and provider_id are required");
        return res.status(400).json({
            message: "username, email, and provider_id are required",
        });
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือยัง (จาก email หรือ provider_id)
    const [existing] = await db.query(
      constant.getUserByProvider,
      [email, provider_id]
    );
    if (existing.length > 0) {
        logger.error(`❌ User already exists: ${email}`);
        return res.status(400).json({ message: "User already exists" });
    }

    // เตรียมข้อมูลสำหรับบันทึก
    const role = "reader";
    const pen_name = null;
    const provider = "google";
    const password = null;

    // บันทึกผู้ใช้ใหม่
    await db.query(constant.insertReaderProvider, [
      username,
      email,
      password,
      role,
      pen_name,
      provider,
      provider_id,
      avatar_url,
    ]);
    logger.info(`✅ Reader created via Google successfully: ${username}`);
    return res.status(201).json({ message: "Reader created via Google successfully" });
  } catch (err) {
    logger.error(`❌ Failed to create reader via Google ${username}: ${err.message}`);
    return res.status(500).json({ message: "Server error" });
  }
};
export const signupReaderFacebook = async (req, res) => {
  try {
    const { username, email, provider_id, avatar_url } = req.body;

    if (!username || !email || !provider_id) {
      logger.error("❌ username, email, and provider_id are required");
      return res.status(400).json({
        message: "username, email, and provider_id are required",
      });
    }

    // ตรวจสอบว่ามีอยู่แล้วหรือยัง
    const [existing] = await db.query(
      constant.getUserByProvider,
      [email, provider_id]
    );
    if (existing.length > 0) {
        logger.error(`❌ User already exists: ${email}`);
        return res.status(400).json({ message: "User already exists" });
    }

    const role = "reader";
    const pen_name = null;
    const provider = "facebook";
    const password = null;

    await db.query(constant.insertReaderProvider, [
      username,
      email,
      password,
      role,
      pen_name,
      provider,
      provider_id,
      avatar_url,
    ]);
    logger.info(`✅ Reader created via Facebook successfully: ${username}`);
    return res.status(201).json({ message: "Reader created via Facebook successfully" });

  } catch (err) {
    logger.error(`❌ Failed to create reader via Facebook ${username}: ${err.message}`);
    return res.status(500).json({ message: "Server error" });
  }
};
export const signupWriterGoogle = async (req, res) => {
    try {
        const { username, email, provider_id, avatar_url, pen_name } = req.body;

        if (!username || !email || !provider_id || !pen_name) {
            logger.error("❌ username, email, provider_id and pen_name are required");
            return res.status(400).json({
                message: "username, email, provider_id and pen_name are required",
            });
        }

        const [existing] = await db.query(constant.getUserByProvider, [email, provider_id]);
        if (existing.length > 0) {
            logger.error(`❌ User already exists: ${email}`);
            return res.status(400).json({ message: "User already exists" });
        }

        const role = "writer";
        const password = null; // No password for social login

        await db.query(constant.insertReaderProvider, [
            username,
            email,
            password,
            role,
            pen_name,
            "google",
            provider_id,
            avatar_url,
        ]);
        logger.info(`✅ Writer created via Google successfully: ${username}`);
        return res.status(201).json({ message: "Writer created via Google successfully" });
    } catch (err) {
        logger.error(`❌ Failed to create writer via Google ${username}: ${err.message}`);
        return res.status(500).json({ message: "Server error" });
    }
};
export const signupWriterFacebook = async (req, res) => {
    try {
        const { username, email, provider_id, avatar_url, pen_name } = req.body;

        if (!username || !email || !provider_id || !pen_name) {
            logger.error("❌ username, email, provider_id and pen_name are required");
            return res.status(400).json({
                message: "username, email, provider_id and pen_name are required",
            });
        }

        const [existing] = await db.query(constant.getUserByProvider, [email, provider_id]);
        if (existing.length > 0) {
            logger.error(`❌ User already exists: ${email}`);
            return res.status(400).json({ message: "User already exists" });
        }

        const role = "writer";
        const password = null; // No password for social login

        await db.query(constant.insertReaderProvider, [
            username,
            email,
            password,
            role,
            pen_name,
            "facebook",
            provider_id,
            avatar_url,
        ]);
        logger.info(`✅ Writer created via Facebook successfully: ${username}`);
        return res.status(201).json({ message: "Writer created via Facebook successfully" });
    } catch (err) {
        logger.error(`❌ Failed to create writer via Facebook ${username}: ${err.message}`);
        return res.status(500).json({ message: "Server error" });
    }
};
export const login = async (req, res) => {
    try{
        const { Account, password } = req.body
        if(!Account || !password){
            logger.error("❌ Not have Username email or password");
            return res.status(400).json({message: "Not have Username email  or password "})
        }
        
        const [users] = await db.query(constant.getUserByemail,[Account, Account]);
        const user = users[0];
        console.log(user)

        if (!user || user.status != "active") {
            logger.error(`❌ User not found or inactive: ${Account}`);
            return res.status(400).json({ message: "User not found or inactive" });
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            logger.error(`❌ Password invalid for user: ${Account}`);
            return res.status(400).json({message: "Password Invalid"})
        }

        const payload = {
            id: user.id,
            email : user.email,
            username: user.username,
            pen_name: user.pen_name || null, 
            role: user.role,
        }
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d'}, (err, token) => {
            if(err){
                logger.error(`❌ JWT signing error: ${err.message}`);
                return res.status(500).json({ message: "Server Error" })
            }
            res.status(200).json({ payload : payload, token: token , message: "Welcome back" })
        })

       

    }catch(err){
        logger.error(`❌ Failed to login user ${Account}: ${err.message}`);
        res.status(500).json({message: "Server error"})
    }
};
export const loginSocialUser = async (req, res) => {
  try {
    const { email, provider, provider_id } = req.body;

    if (!email || !provider || !provider_id) {
        logger.error("❌ email, provider, and provider_id are required");
      return res.status(400).json({ message: "email, provider, and provider_id are required" });
    }

    // ตรวจสอบผู้ใช้จาก email และ provider_id
    const [users] = await db.query(constant.getUserByEmailAndProvider, [email, provider_id]);
    const user = users[0];

    if (!user || user.provider !== provider) {
        logger.error(`❌ User not found or provider mismatch: ${email}`);
        return res.status(404).json({ message: "User not found or provider mismatch" });
    }

    if (user.status !== "active") {
      logger.error(`❌ Account is disabled: ${email}`);
      return res.status(403).json({ message: "Account is disabled" });
    }

    // สร้าง JWT
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url,
      provider: user.provider,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
    logger.info(`✅ User logged in successfully: ${email}`);
    return res.status(200).json({
      message: "Login successful",
      token,
      user: payload,
    });

  } catch (err) {
    logger.error(`❌ Failed to login user ${email}: ${err.message}`);
    return res.status(500).json({ message: "Server error" });
  }
};
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            logger.error("❌ Email is required");
            return res.status(400).json({ message: "Email is required" });
        }

        // Logic to handle password reset (e.g., send reset link)
        // This is a placeholder; actual implementation will depend on your requirements
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (user.length === 0) {
            logger.error(`❌ User not found: ${email}`);
            return res.status(404).json({ message: "User not found" });
        }

        logger.info(`✅ Password reset link sent to user: ${email}`);
        res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (err) {
        logger.error(`❌ Failed to send password reset link to user ${email}: ${err.message}`);
        res.status(500).json({ message: "Server error" });
    }
};
export const resetPassword = async (req, res) => {
  const { email, new_password } = req.body;

  if (!email || !new_password) {
    logger.error("❌ Email and new password are required");
    return res.status(400).json({ message: "Email and new password are required" });
  }

  const hashed = await bcrypt.hash(new_password, 10);
  const [result] = await db.query("UPDATE users SET password = ? WHERE email = ?", [
    hashed,
    email,
  ]);

  if (result.affectedRows === 0) {
    logger.error(`❌ User not found for password reset: ${email}`);
    return res.status(404).json({ message: "User not found" });
  }
    logger.info(`✅ Password reset successful for user: ${email}`);
  return res.status(200).json({ message: "Password reset successful" });
};
export const updateUserProfile = async (req, res) => {
  try {
    const { userId, username, pen_name, avatar_url, status, password } = req.body;

    const fields = [];
    const values = [];

    if (username) {
      fields.push("username = ?");
      values.push(username);
    }

    if (pen_name) {
      fields.push("pen_name = ?");
      values.push(pen_name);
    }

    if (avatar_url) {
      fields.push("avatar_url = ?");
      values.push(avatar_url);
    }

    if (status) {
      if (!["active", "disabled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }
      fields.push("status = ?");
      values.push(status);
    }

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      fields.push("password = ?");
      values.push(hashed);
    }

    if (fields.length === 0) {
        logger.error("❌ No fields provided for update");
        return res.status(400).json({ message: "No fields provided for update" });
    }

    values.push(userId);

    const sql = `UPDATE users SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
        logger.error(`❌ User not found for update: ${userId}`);
        return res.status(404).json({ message: "User not found" });
    }

    logger.info(`✅ User updated successfully: ${userId}`);
    return res.status(200).json({ message: "User updated successfully" });

  } catch (err) {
    logger.error(`❌ Failed to update user ${userId}: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
