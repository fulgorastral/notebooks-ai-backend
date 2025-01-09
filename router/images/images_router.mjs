import express from "express"
const router = express.Router()
import unsplash from "./unsplash_api.mjs"
import { normalizeResultsFreepik, normalizeResultsUnsplash } from "./normalize_results.mjs"
import queryFreepikAPI from "./freepik_api.mjs"

// GET /api/images
router.get("/", async (req, res) => {
    const query = req.query.q

    // Get from Unsplash
    let normUnsplash = []
    try{
        const responseUnsplash = await unsplash.search.getPhotos({
            query,
            perPage: 9,
        })
        if (responseUnsplash.type === "error") {
            if (responseUnsplash.status === 400) {
                res.status(400).json({ error: responseUnsplash.error })
                return
            }
            res.status(500).json({ error:  "Internal server error" })
            return
        }
        normUnsplash = normalizeResultsUnsplash(responseUnsplash)
    } 
    catch (error) {
        console.error(`Error getting images from Unsplash: ${error}`)
    }

    // Get from Freepik
    let normFreepik = []
    try{
        const responseFreepik = await queryFreepikAPI({ term: query })
        if (responseFreepik.status === 400) {
            res.status(400).json({ error: responseFreepik.error })
            return
        }
        if (responseFreepik.status === 500) {
            res.status(500).json({ error: "Internal server error" })
            return
        }
    
        const dataFreepik = await responseFreepik.json()
        normFreepik = normalizeResultsFreepik(dataFreepik)
    } 
    catch (error) {
        console.error(`Error getting images from Freepik: ${error}`)
    }

    res.json([...normUnsplash, ...normFreepik])
})

export default router
