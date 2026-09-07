import pg from "pg";
import dotenv from 'dotenv';

dotenv.config();


const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

setInterval(() => {
    console.log(
        "Pool stats:",
        "total =", pool.totalCount,
        "idle =", pool.idleCount,
        "waiting =", pool.waitingCount
    );
}, 5000);

pool.on("connect", () => {
    console.log("New PostgreSQL connection created");
});

pool.on("remove", () => {
    console.log("PostgreSQL connection removed");
});

export default pool;