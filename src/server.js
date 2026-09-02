import express from "express";
import dotenv from 'dotenv';
import urlRoutes from "./routes/urls.js";

dotenv.config();

const PORT = 4000;

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to URL Shortener API" });
});

app.get("/health", (req, res) => {
    if (process.env.HEALTH_FAIL === "true") {
        return res.status(500).json({ status: "failed"});
    }
    res.status(200).json({ status: "ok"});
});

app.use((req, res, next) => {
    console.log("REQUEST:", process.env.HOSTNAME, req.method, req.originalUrl);
    next();
});

// Route to different endpoints
app.use("/api/v1/urls", urlRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(process.env.APP_PORT||PORT, ()=> {
    console.log("Server listening on port :", process.env.APP_PORT||PORT);
})