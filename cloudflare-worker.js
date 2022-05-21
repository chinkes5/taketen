function setScore(key, data) {
    return Score.put(key, data);
}
const getScore = () => Score.get(key);

async function updateScore(request) {
    const body = await request.text();
    const cacheKey = request.headers.get('key');
    try {
        JSON.parse(body);
        await setScore(cacheKey, body);
        return new Response(body, { status: 200 });
    } catch (err) {
        return new Response(err, { status: 500 });
    };
};

const defaultData = { name: "jemc", score: 545 }
async function getScores(request) {
    const cacheKey = request.headers.get('key');
    let data;
    const cache = await getScore(cacheKey);
    if (!cache) {
        await setScore(cacheKey, JSON.stringify(defaultData));
        data = defaultData;
    } else {
        data = JSON.parse(cache);
    }
    return data;
}

async function handleRequest(request) {
    console.log('Got request', request)
    if (request.method === "PUT") {
        return updateScore(request);
    } else {
        return getScores(request);
    };
};

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
