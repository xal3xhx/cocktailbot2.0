const {get, post, getURL} = require("./functions.js");
const host = process.env.RADARR_HOST;
const port = process.env.RADARR_PORT;
const ssl = process.env.RADARR_SSL;
const apiKey = process.env.RADARR_APIKEY;
// test connecting to radarr
async function testRadarr() {
    const url = await getURL(host, port, ssl, `/api/v3/system/status?apikey=${apiKey}`);
    const options = {
        url,
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    };
    const {response, body} = await get(options);
    if (response.statusCode === 200) {
        return true;
    } else {
        return false;
    }
}

// using radarr's rest api get the list of movies
async function getMovies() {
    const url = await getURL(host, port, ssl, `/api/v3/movie?apikey=${apiKey}`);
    const options = {
        url,
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    };
    const {response, body} = await get(options);
    if (response.statusCode !== 200) {
        throw new Error(`${response.statusCode}: ${body}`);
    }
    return body;
}

async function addMovie(movie) {
    const url = await getURL(host, port, ssl, `/api/v3/movie?apikey=${apiKey}`);
    const options = {
        url,
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: `{
            "title": "${movie.title}",
            "tmdbId": ${movie.id},
            "monitored": true,
            "minimumAvailability": "released",
            "qualityProfileId": 1,
            "rootFolderPath": "/Media/Movies Sorted",
            "addOptions": {
                "searchForMovie": true
            }
        }`
    };
    const {response, body} = await post(options);
    if (response.statusCode !== 201) {
        throw new Error(`${response.statusCode}: ${body}`);
    }
    return body;
}

// seach movie by title
// limit to 20 results
async function searchMovie(search) {
    // if search start with tmdb: then use the tmdb endpoint
    const url = await getURL(host, port, ssl, `/api/v3/movie/lookup?apikey=${apiKey}&term=${search}`);
    const options = {
        url,
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    };
    const {response, body} = await get(options);
    if (response.statusCode !== 200) {
        throw new Error(`${response.statusCode}: ${body}`);
    }
    // parse the json and return the first 20 results
    const movies = JSON.parse(body);
    return movies.slice(0, 20);
}



module.exports = { testRadarr, getMovies, searchMovie, addMovie };