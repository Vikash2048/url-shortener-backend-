import express from "express";
import pool from "../db.js";
import redisClient from "../redis.js";
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Create short URL
router.post("/shorten", async (req, res) => {
    try {
        const originalUrl = req.body.url;
        console.log("OriginalURL : ", originalUrl);

        // generate short code for now using temp short code
        const shortCode = Math.random().toString(36).substring(2,8);
        
        // Insert original URL and short code into database
        const query = "INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *";
        const result = await pool.query(query, [originalUrl, shortCode]);
        
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

        // Check Redis cache first
        const cachedUrl = await redisClient.get(shortCode);
        if (cachedUrl) {
            console.log("Cache hit for", shortCode);
            return res.redirect(cachedUrl);
        }
        else {
            console.log("cache miss")
        }

        // Query database to find the short code
        const query = "SELECT original_url FROM urls WHERE short_code = $1";
        const result = await pool.query(query, [shortCode]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Short code not found" });
        }

        const originalUrl = result.rows[0].original_url;

        // Populate cache for next time
        await redisClient.set(shortCode, originalUrl, { EX: 3600 });

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