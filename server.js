import dotenv from "dotenv";
dotenv.config();

import express from "express"
import morgan from "morgan"
import cors from "cors"
import { readdirSync } from "fs"


const app = express()
app.use(morgan("dev"))
app.use(express.json())
app.use(cors())
app.use(express.static("public"))

readdirSync("./routes").forEach(async (r) => {
  const route = await import(`./routes/${r}`)
  app.use("", route.default)
})

app.listen(process.env.PORT || 3000, () =>
    console.log('server is running')
)