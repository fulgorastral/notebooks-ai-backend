
import dotenv from "dotenv"

// Dotenv
dotenv.config()

const FREEPIK_API_KEY = process.env.FREEPIK_API_KEY
const options = {method: 'GET', headers: {'x-freepik-api-key': FREEPIK_API_KEY}}


export default function queryFreepikAPI(params) {
    const url = new URL('https://api.freepik.com/v1/resources')
    // Default search parameters
    url.searchParams.append('limit', 9)

    // Custom search parameters
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    return fetch(url.toString(), options)
}