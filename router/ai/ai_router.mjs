import express from "express"
import { askAI as askOpenAI } from "./openai_api.mjs"
import { askGeminiAI } from "./gemini_api.mjs"
const router = express.Router()

// GET /api/ai
router.get("/", async (req, res) => {
    res.json({test: "Hello from the AI router!"})
})

router.post("/section", async (req, res) => {
    const prompt = req.body.q
    const history = req.body.history
    const textHistory = req.body.textHistory
    const currentSection = req.body.currentSection
    // const aiRes = await askOpenAI(prompt, history, textHistory, currentSection)
    const aiRes = await askGeminiAI(prompt, history, textHistory, currentSection)

    res.json(aiRes)
})


export default router
