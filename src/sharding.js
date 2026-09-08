import crypto from "crypto";
import { shard1, shard2, shard3 } from "./db.js";

const shards = [shard1, shard2, shard3];

const getShard = (shortCode) => {
    const hash = crypto.createHash("sha256").update(shortCode).digest();
    const number = hash.readUInt32BE(0);
    const shardIndex = number % shards.length;
    console.log(
        `shortCode=${shortCode} → shard=${shardIndex + 1}`
    );
    return shards[shardIndex];
}

export { getShard };