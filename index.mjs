import dotenv from 'dotenv'

// Dotenv
dotenv.config()

// server
import fetch from 'node-fetch'
import express from 'express'
import imagesRouter from './router/images/images_router.mjs'
import aiRouter from './router/ai/ai_router.mjs'

// Fetch
global.fetch = fetch

// Express
const app = express()

// Welcome message
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello from the server!" })
})

// Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next()
})

app.use(express.json());

// Images router
app.use("/api/images", imagesRouter)
// AI router
app.use("/api/ai", aiRouter)

// Start server
app.listen(3000, () => {
    console.log("Server running on https://localhost:3000")
})
