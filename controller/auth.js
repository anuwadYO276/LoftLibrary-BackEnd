import db from "../lib/db.js"
import constant from "../lib/constant.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import logger from '../utils/logger.js';


export const signupReader = async (req, res) => {
    try{
        const { username, email, password } = req.body
        if(!username || !email || !password){
            let set_res = {
              statusCode: 400,
              message: "username, email, and password are required",
              data: null
            }
            logger.error("❌ username, email, and password are required");
            return res.status(400).json(set_res)
        }

        const [reader] = await db.query(constant.getUserByemail, [email, username])
        if(reader.length > 0){
            logger.error(`❌ User already exists: ${email}`);
            let set_res = {
              statusCode: 400,
              message: "User already exists",
              data: null
            }
            return res.status(400).json(set_res)
        }

        const pen_name = null
        const Userrole = "reader"
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.query(constant.insertReader, [username, email, hashedPassword, Userrole])
        logger.info(`✅ User created successfully: ${username}`);
        let set_res = {
          statusCode: 201,
          message: "User create success",
          data: null
        }
        res.status(201).json(set_res)

    }catch(err){
        logger.error(`❌ Failed to create user ${username}: ${err.message}`);
        let set_res = {
          statusCode: 500,
          message: "Server error",
          data: null
        }
        res.status(500).json(set_res)
    }
};
export const signupWriter = async (req, res) => {
    try{
        const { username, email, password, pen_name } = req.body
        if(!username || !email || !password || !pen_name){
            logger.error("❌ username, email, password, and pen_name are required");
            let set_res = {
              statusCode: 400,
              message: "username email password and penname are required",
              data: null
            }
            return res.status(400).json(set_res)
        }

        const [writer] = await db.query(constant.getUserByemail, [email, username, pen_name])
        if(writer.length > 0){

            logger.error(`❌ User already exists: ${email}`);
            let set_res = {
              statusCode: 400,
              message: "User already exists",
              data: null
            }
            return res.status(400).json(set_res)
        }

        const Userrole = "writer"
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.query(constant.insertWriter, [username, email, hashedPassword, pen_name, Userrole])
        logger.info(`✅ User writer created successfully: ${username}`);
        let set_res = {
          statusCode: 201,
          message: "User writer create success",
          data: null
        }
        res.status(201).json(set_res)

    }catch(err){
        logger.error(`❌ Failed to create user writer ${username}: ${err.message}`);
        let set_res = {
          statusCode: 500,
          message: "Server error",
          data: null
        }
        res.status(500).json(set_res)
    }
};
export const signupReaderGoogle = async (req, res) => {
  try {
    const { username, email, provider_id, avatar_url } = req.body;

    // ตรวจสอบ input
    if (!username || !email || !provider_id) {
        logger.error("❌ username, email, and provider_id are required");
        let set_res = {
          statusCode: 400,
          message: "username, email, and provider_id are required",
          data: null
        }
        return res.status(400).json(set_res)
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่แล้วหรือยัง (จาก email หรือ provider_id)
    const [existing] = await db.query(
      constant.getUserByProvider,
      [email, provider_id]
    );
    if (existing.length > 0) {
        logger.error(`❌ User already exists: ${email}`);
        let set_res = {
          statusCode: 400,
          message: "User already exists",
          data: null
        }
        return res.status(400).json(set_res);
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
    let set_res = {
      statusCode: 201,
      message: "Reader created via Google successfully",
      data: null
    };
    return res.status(201).json(set_res);
  } catch (err) {
    logger.error(`❌ Failed to create reader via Google ${username}: ${err.message}`);
    let set_res = {
      statusCode: 500,
      message: "Server error",
      data: null
    };
    return res.status(500).json(set_res);
  }
};
export const signupReaderFacebook = async (req, res) => {
  try {
    const { username, email, provider_id, avatar_url } = req.body;

    if (!username || !email || !provider_id) {
      logger.error("❌ username, email, and provider_id are required");
      let set_res = {
        statusCode: 400,
        message: "username, email, and provider_id are required",
        data: null
      };
      return res.status(400).json(set_res);
    }

    // ตรวจสอบว่ามีอยู่แล้วหรือยัง
    const [existing] = await db.query(
      constant.getUserByProvider,
      [email, provider_id]
    );
    if (existing.length > 0) {
        logger.error(`❌ User already exists: ${email}`);
      const res = {
        statusCode: 400,
        message: "User already exists",
        data: null
      };
        return res.status(400).json(set_res);
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
    let set_res = {
      statusCode: 201,
      message: "Reader created via Facebook successfully",
      data: null
    };
    return res.status(201).json(set_res);

  } catch (err) {
    logger.error(`❌ Failed to create reader via Facebook ${username}: ${err.message}`);
    let set_res = {
      statusCode: 500,
      message: "Server error",
      data: null
    };
    return res.status(500).json(set_res);
  }
};
export const signupWriterGoogle = async (req, res) => {
    try {
        const { username, email, provider_id, avatar_url, pen_name } = req.body;

        if (!username || !email || !provider_id || !pen_name) {
            logger.error("❌ username, email, provider_id and pen_name are required");
            let set_res = {
                statusCode: 400,
                message: "username, email, provider_id and pen_name are required",
                data: null
            };
            return res.status(400).json(set_res);
        }

        const [existing] = await db.query(constant.getUserByProvider, [email, provider_id]);
        if (existing.length > 0) {
            logger.error(`❌ User already exists: ${email}`);
            let set_res = {
                statusCode: 400,
                message: "User already exists",
                data: null
            };
            return res.status(400).json(set_res);
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
        let set_res = {
            statusCode: 201,
            message: "Writer created via Google successfully",
            data: null
        };
        return res.status(201).json(set_res);
    } catch (err) {
        logger.error(`❌ Failed to create writer via Google ${username}: ${err.message}`);
        let set_res = {
            statusCode: 500,
            message: "Server error",
            data: null
        };
        return res.status(500).json(set_res);
    }
};
export const signupWriterFacebook = async (req, res) => {
    try {
        const { username, email, provider_id, avatar_url, pen_name } = req.body;

        if (!username || !email || !provider_id || !pen_name) {
            logger.error("❌ username, email, provider_id and pen_name are required");
            let set_res = {
                statusCode: 400,
                message: "username, email, provider_id and pen_name are required",
                data: null
            };
            return res.status(400).json(set_res);
        }

        const [existing] = await db.query(constant.getUserByProvider, [email, provider_id]);
        if (existing.length > 0) {
            logger.error(`❌ User already exists: ${email}`);
            const res = {
                statusCode: 400,
                message: "User already exists",
                data: null
            };
            return res.status(400).json(set_res);
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
        let set_res = {
            statusCode: 201,
            message: "Writer created via Facebook successfully",
            data: null
        };
        return res.status(201).json(set_res);
    } catch (err) {
        logger.error(`❌ Failed to create writer via Facebook ${username}: ${err.message}`);
        let set_res = {
            statusCode: 500,
            message: "Server error",
            data: null
        };
        return res.status(500).json(set_res);
    }
};
export const login = async (req, res) => {
    try{
        const { Account, password } = req.body
        if(!Account || !password){
            logger.error("❌ Not have Username email or password");
            let set_res = {
              statusCode: 400,
              message: "Not have Username email or password",
              data: null
            };
            return res.status(400).json(set_res);
        }
        
        const [users] = await db.query(constant.getUserByemail,[Account, Account]);
        const user = users[0];
        console.log(user)

        if (!user || user.status != "active") {
            logger.error(`❌ User not found or inactive: ${Account}`);
            let set_res = {
              statusCode: 400,
              message: "User not found or inactive",
              data: null
            };
            return res.status(400).json(set_res);
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            logger.error(`❌ Password invalid for user: ${Account}`);
            let set_res = {
              statusCode: 400,
              message: "Password Invalid",
              data: null
            };
            return res.status(400).json(set_res);
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
                let set_res = {
                    statusCode: 500,
                    message: "Server Error",
                    data: null
                };
                return res.status(500).json(set_res);
            }
            let set_res = {
                statusCode: 200,
                message: "Welcome back",
                data: { payload, token }
            };
            res.status(200).json(set_res);
        })

       

    }catch(err){
        logger.error(`❌ Failed to login user ${Account}: ${err.message}`);
        let set_res = {
            statusCode: 500,
            message: "Server error",
            data: null
        };
        res.status(500).json(set_res);
    }
};
export const loginSocialUser = async (req, res) => {
  try {
    const { email, provider, provider_id } = req.body;

    if (!email || !provider || !provider_id) {
        logger.error("❌ email, provider, and provider_id are required");
        let set_res = {
            statusCode: 400,
            message: "email, provider, and provider_id are required",
            data: null
        };
      return res.status(400).json(set_res);
    }

    // ตรวจสอบผู้ใช้จาก email และ provider_id
    const [users] = await db.query(constant.getUserByEmailAndProvider, [email, provider_id]);
    const user = users[0];

    if (!user || user.provider !== provider) {
        logger.error(`❌ User not found or provider mismatch: ${email}`);
        let set_res = {
            statusCode: 404,
            message: "User not found or provider mismatch",
            data: null
        };
        return res.status(404).json(set_res);
    }

    if (user.status !== "active") {
      logger.error(`❌ Account is disabled: ${email}`);
      let set_res = {
          statusCode: 403,
          message: "Account is disabled",
          data: null
      };
      return res.status(403).json(set_res);
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

    let set_res = {
      statusCode: 200,
      message: "Login successful",
      data: { token, user: payload }
    };
    return res.status(200).json(set_res);

  } catch (err) {
    logger.error(`❌ Failed to login user ${email}: ${err.message}`);
    let set_res = {
      statusCode: 500,
      message: "Server error",
      data: null
    };
    return res.status(500).json(set_res);
  }
};
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            logger.error("❌ Email is required");
            let set_res = {
                statusCode: 400,
                message: "Email is required",
                data: null
            };
            return res.status(400).json(set_res);
        }

        // Logic to handle password reset (e.g., send reset link)
        // This is a placeholder; actual implementation will depend on your requirements
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (user.length === 0) {
            logger.error(`❌ User not found: ${email}`);
            let set_res = {
                statusCode: 404,
                message: "User not found",
                data: null
            };
            return res.status(404).json(set_res);
        }

        logger.info(`✅ Password reset link sent to user: ${email}`);
        let set_res = {
            statusCode: 200,
            message: "Password reset link sent to your email",
            data: null
        };
        return res.status(200).json(set_res);
    } catch (err) {
        logger.error(`❌ Failed to send password reset link to user ${email}: ${err.message}`);
        let set_res = {
            statusCode: 500,
            message: "Server error",
            data: null
        };
        return res.status(500).json(set_res);
    }
};
export const resetPassword = async (req, res) => {
  const { email, new_password } = req.body;

  if (!email || !new_password) {
    logger.error("❌ Email and new password are required");
    let set_res = {
        statusCode: 400,
        message: "Email and new password are required",
        data: null
    };
    return res.status(400).json(set_res);
  }

  const hashed = await bcrypt.hash(new_password, 10);
  const [result] = await db.query("UPDATE users SET password = ? WHERE email = ?", [
    hashed,
    email,
  ]);

  if (result.affectedRows === 0) {
    logger.error(`❌ User not found for password reset: ${email}`);
    let set_res = {
        statusCode: 404,
        message: "User not found",
        data: null
    };
    return res.status(404).json(set_res);
  }
    logger.info(`✅ Password reset successful for user: ${email}`);
    let set_res = {
      statusCode: 200,
      message: "Password reset successful",
      data: null
    };
  return res.status(200).json(set_res);
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
        let set_res = {
            statusCode: 400,
            message: "No fields provided for update",
            data: null
        };
        return res.status(400).json(set_res);
    }

    values.push(userId);

    const sql = `UPDATE users SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    const [result] = await db.query(sql, values);

    if (result.affectedRows === 0) {
        logger.error(`❌ User not found for update: ${userId}`);
        let set_res = {
            statusCode: 404,
            message: "User not found",
            data: null
        };
        return res.status(404).json(set_res);
    }

    logger.info(`✅ User updated successfully: ${userId}`);
    let set_res = {
        statusCode: 200,
        message: "User updated successfully",
        data: null
    };
    return res.status(200).json(set_res);

  } catch (err) {
    logger.error(`❌ Failed to update user ${userId}: ${err.message}`);
    let set_res = {
        statusCode: 500,
        message: "Server error",
        data: null
    };
    return res.status(500).json(set_res);
  }
};
