import pg from "pg";
import dotenv from 'dotenv';

dotenv.config();


const { Pool } = pg;

// const pool = new Pool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     max: 2,
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 2000
// });

const shard1 = new Pool({
    host: "postgres-shard-1",
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "url_shard_1"
})

const shard1Replica = new Pool({
    host: "postgres-shard-1-replica",
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "url_shard_1"
});

const shard2 = new Pool({
    host: "postgres-shard-2",
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "url_shard_2"
})

const shard3 = new Pool({
    host: "postgres-shard-3",
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "url_shard_3"
})

const writePool = new Pool({
    host: process.env.DB_PRIMARY_HOST,
    port: process.env.DB_PRIMARY_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

const readPool = new Pool({
    host: process.env.DB_REPLICA_HOST,
    port: process.env.DB_REPLICA_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

// setInterval(() => {
//     console.log(
//         "Pool stats:",
//         "total =", pool.totalCount,
//         "idle =", pool.idleCount,
//         "waiting =", pool.waitingCount
//     );
// }, 5000);

// pool.on("connect", () => {
//     console.log("New PostgreSQL connection created");
// });

// pool.on("remove", () => {
//     console.log("PostgreSQL connection removed");
// });

export { readPool, writePool, shard1, shard2, shard3, shard1Replica };