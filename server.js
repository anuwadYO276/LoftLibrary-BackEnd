import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import cors from "cors";
import { readdirSync } from "fs";
import basicAuth from "basic-auth";
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import loginRoutes from './routes/login.js';
import profileRoutes from './routes/profile.js';

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// Basic Auth middleware
const authMiddleware = (req, res, next) => {
  const user = basicAuth(req);

  const USERNAME = process.env.BASIC_AUTH_USER;
  const PASSWORD = process.env.BASIC_AUTH_PASS;

  if (!user || user.name !== USERNAME || user.pass !== PASSWORD) {
    res.set("WWW-Authenticate", 'Basic realm="401"');
    return res.status(401).send("Authentication required.");
  }
  next();
};

app.use(authMiddleware);

app.use('/signup', authRoutes);
app.use('/login', loginRoutes);
app.use('/profile', profileRoutes);
app.use('/product', productRoutes);
// readdirSync("./routes").forEach(async (r) => {
//   const route = await import(`./routes/${r}`);
//   app.use("", route.default);
// });

app.listen(process.env.PORT || 3000, () =>
  console.log("server is running")
);
