import db from "../lib/db.js"
import constant from "../lib/constant.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const signupReader = async (req, res) => {
    try{
        const { username, email, password } = req.body
        if(!username || !email || !password){
            return res.status(400).json({message: "username email and password are required"})
        }

        const [reader] = await db.query(constant.getUserByemail, [email, username])
        if(reader.length > 0){
            return res.status(400).json({ message: "User already exists" })
        }

        const pen_name = null
        const Userrole = "reader"
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.query(constant.insertReader, [username, email, hashedPassword, Userrole , pen_name])
        res.status(201).json({ message: "User create success" })

    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server error"})
    }
}

export const signupWriter = async (req, res) => {
    try{
        const { username, email, password, pen_name } = req.body
        if(!username || !email || !password || !pen_name){
            return res.status(400).json({message: "username email password and penname are required"})
        }

        const [writer] = await db.query(constant.getUserByemail, [email, username, pen_name])
        if(writer.length > 0){
            return res.status(400).json({ message: "User already exists" })
        }

        const Userrole = "writer"
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.query(constant.insertWriter, [username, email, hashedPassword, pen_name, Userrole])
        res.status(201).json({ message: "User writer create success" })

    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server error"})
    }
}

export const login = async (req, res) => {
    try{
        const { Account, password } = req.body
        if(!Account || !password){
            return res.status(400).json({message: "Not have Username email  or password "})
        }
        
        const [users] = await db.query(constant.getUserByemail,[Account, Account]);
        const user = users[0];

        if (!user || !user.enabled) {
            return res.status(400).json({ message: "User not found or not enabled" });
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
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
                return res.status(500).json({ message: "Server Error" })
            }
            res.status(200).json({ payload : payload, token: token , message: "Welcome back" })
        })

       

    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server error"})
    }
}