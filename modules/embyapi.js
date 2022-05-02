const {get, post, getURL} = require("./functions.js");
const host = process.env.EMBY_HOST;
const port = process.env.EMBY_PORT;
const ssl = process.env.EMBY_SSL;
const apiKey = process.env.EMBY_APIKEY;
const userID = process.env.EMBY_USERID;


async function testEmby() {
    const url = await getURL(host, port, ssl, `/System/Ping?api_key=${apiKey}`);
    console.log(url);
    const options = {
        url,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'X-Emby-Token': apiKey,
        },
    };
    const {response, body} = await get(options);
    if (response.statusCode !== 200) {
        throw new Error(`${response.statusCode}: ${body}`);
    }
    let parse = JSON.parse(body);
    return parse;
}

async function searchMovie(search) {
    const url = await getURL(host, port, ssl, `/Users/${userID}/Items?Recursive=true&IncludeItemTypes=movie&SearchTerm=${search}&api_key=${apiKey}`);
    const options = {
        url,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'X-Emby-Token': apiKey,
        },
    };
    const {response, body} = await get(options);
    if (response.statusCode !== 200) {
        throw new Error(`${response.statusCode}: ${body}`);
    }
    let parse = JSON.parse(body);
    return parse["Items"];
}

async function getPathByID(id) {
    const url = await getURL(host, port, ssl, `/Items/${id}/PlaybackInfo?api_key=${apiKey}`);
    const options = {
        url,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'X-Emby-Token': apiKey,
        },
    };
    const {response, body} = await get(options);
    if (response.statusCode !== 200) {
        throw new Error(`${response.statusCode}: ${body}`);
    }
    let parse = JSON.parse(body);
    return parse["MediaSources"][0]["Path"]; 
}



module.exports = { testEmby, searchMovie, getPathByID };



