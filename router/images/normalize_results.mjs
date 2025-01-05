export function normalizeResultsUnsplash(results){
    const queryResults = results.response.results
    const normalizedResults = queryResults.map(result => {
        return {
            id: result.id,
            src: result.urls.small,
            description: result.alt_description,
            height: result.height,
            width: result.width,
            src: result.urls.regular,
            thumb: result.urls.thumb,
        }
    })

    return normalizedResults
}


export function normalizeResultsFreepik(results){
    return results.data.map(result => {
        const dims = result.image.source.size.split("x").map(dim => parseInt(dim))
        return {
            id: result.id,
            src: result.image.source.url,
            description: result.title,
            width: dims[0],
            height: dims[1],
            thumb: result.image.source.url,
        }
    })
}