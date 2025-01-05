import express from "express"
import { askAI } from "./openai_api.mjs"
const router = express.Router()

// GET /api/ai
router.get("/", async (req, res) => {
    res.json({test: "Hello from the AI router!"})
})

router.get("/section", async (req, res) => {
    const prompt = req.query.p
    const aiRes = await askAI(prompt)
    res.json(aiRes)
})

export default router
