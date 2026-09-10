import redisClient from "../redis.js";

const LIMIT = 10;
const WINDOW = 60; // seconds

export async function rateLimiter(req, res, next) {
    try {
        const ip = req.ip;
        const key = `rate_limit:${ip}`;

        const now = Date.now();
        const windowStart = now - WINDOW * 1000;

        const multi = redisClient.multi();

        // Remove requests outside the current window
        multi.zRemRangeByScore(key, 0, windowStart);

        // Add current request
        multi.zAdd(key, [
            {
                score: now,
                value: `${now}-${Math.random()}`
            }
        ]);

        // Count requests inside window
        multi.zCard(key);

        // Keep Redis key alive
        multi.expire(key, WINDOW);

        const results = await multi.exec();

        const count = results[2];

        if (count > LIMIT) {
            return res.status(429).json({
                error: "Too many requests"
            });
        }

        next();

    } catch (error) {
        console.error("Rate limiter error:", error);
        next();
    }
}