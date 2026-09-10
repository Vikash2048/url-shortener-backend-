import crypto from "crypto";
import { shard1, shard2, shard3, shard1Replica } from "./db.js";

const shards = [shard1, shard2, shard3];

const shardMap = [
    {
        primary: shard1,
        replica: shard1Replica
    },
    {
        primary: shard2,
        replica: null
    },
    {
        primary: shard3,
        replica: null
    }
];

const getShard = (shortCode) => {
    const hash = crypto.createHash("sha256").update(shortCode).digest();
    const number = hash.readUInt32BE(0);
    const shardIndex = number % shardMap.length;
    console.log(
        `shortCode=${shortCode} → shard=${shardIndex + 1}`
    );
    // return shards[shardIndex];
    return shardMap[shardIndex];
}

export { getShard };