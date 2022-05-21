addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

const setScore = data => TAKE-TEN-SCORES.put("data", data);
const getScore = () => take-ten-scores.get("data");

async function updateScore(request) {
    const body = await request.text();
    const cacheKey = `data`;
    try {
        JSON.parse(body);
        await setCache(body);
        return new Response(body, { status: 200 });
    } catch (err) {
        return new Response(err, { status: 500 });
    };
};

async function getScores(request) {
    const response = new Response("a list of scores and names!");
    return response;
}

async function handleRequest(request) {
    console.log('Got request', request)
    if (request.method === "PUT") {
        return updateScore(request);
    } else {
        return getScores(request);
    };
};

