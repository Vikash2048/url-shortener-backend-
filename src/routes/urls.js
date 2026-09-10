import express from "express";
import {writePool, readPool, shard1, shard2, shard3} from "../db.js";
import redisClient from "../redis.js";
import dotenv from "dotenv";
import { getShard } from "../sharding.js";
import { rateLimiter } from "../middleware/ratelimiter.js";

dotenv.config();

const router = express.Router();

// Create short URL
router.post("/shorten", rateLimiter, async (req, res) => {
    try {
        const originalUrl = req.body.url;
        console.log("OriginalURL : ", originalUrl);

        // generate short code for now using temp short code
        const shortCode = Math.random().toString(36).substring(2,8); 
        
        // decide which shard owns this shortCode
        const shard = getShard(shortCode);

        // Insert original URL and short code into database
        const query = "INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *";
        // const result = await pool.query(query, [originalUrl, shortCode]);
        // const result = await writePool.query(query, [originalUrl, shortCode]);
        // const result = await shard.query(query, [originalUrl, shortCode]);
        const result = await shard.primary.query(query, [originalUrl, shortCode]);

        //redis 
        await redisClient.set(shortCode, originalUrl, {EX:3600});

        // res.json({
        //     message: "Create short URL endpoint",
        //     data: result.rows[0]
        // });
        res.json({
            shortCode: result.rows[0].short_code,
            shortUrl: `http://localhost:${process.env.APP_PORT}/${result.rows[0].short_code}`
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to create short URL" });
    }
});



// Get original URL from short code
router.get("/:shortCode", async (req, res) => {
  // console.log(`Server PID: ${process.pid}`);
  console.log("Handled by:", process.env.HOSTNAME);
  try {
    const { shortCode } = req.params;
    console.log("shortCode: ", shortCode)

    // Check Redis cache first
    // const cachedUrl = await redisClient.get(shortCode);
    // if (cachedUrl) {
    //   console.log("Cache hit for", shortCode);
    //   return res.redirect(cachedUrl);
    // } else {
    //   console.log("cache miss");
    // }
    console.log("bypass cache for hot-shard test");

    //find the correct shard
    const shard = getShard(shortCode);

    const query = "SELECT original_url FROM urls WHERE short_code = $1";
    let result;

    try{
      console.log("trying primary...")
      result = await shard.primary.query(query, [shortCode]);
    } catch (error) {
      console.log("Primary failed. Trying replica...");

      if (!shard.replica) {
        throw error;
      }

      result = await shard.replica.query(query, [shortCode]);
    }

    // Query database to find the short code
    // const result = await readPool.query(query, [shortCode]);
    // const result = await shard.query(query, [shortCode]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Short code not found" });
    }

    const originalUrl = result.rows[0].original_url;

    // Populate cache for next time
    // await redisClient.set(shortCode, originalUrl, { EX: 3600 });

    // Redirect to original URL
    res.redirect(originalUrl);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to redirect" });
  }
});

// Get all URLs
router.get("/", (req, res) => {
  res.json({ message: "Get all URLs endpoint" });
});

export default router;
