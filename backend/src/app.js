import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

//100mb video can be uplaoded 
app.use(express.json({ limit: "100mb" }))
app.use(express.urlencoded({ extended: true, limit: "100mb" }))
app.use(express.static("public"))
app.use(cookieParser())

// Routes import
//  DEBUG COOKIE ROUTE
// In app.js, BEFORE your userRouter
app.get("/api/v1/debug-cookies", (req, res) => {
  console.log("🧁 Cookies received:", req.cookies);
  res.json(req.cookies);
});

import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'

// Routes declaration
app.use("/api/v1/users", userRouter) // Enables /api/v1/users/register
app.use("/api/v1/videos", videoRouter)

app.get("/", (req, res) => {
  res.send("API is running");
})

export { app }
