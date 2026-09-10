import crypto from "crypto";

const keys = [
    "4zsrmc", "vy44m7", "og2x6q", "4bioz7", "jv5vmq",
    "m2apb1", "pgr84e", "2hd4de", "deg9lz",
    "vcqs4m", "92bqyp", "k9gbi1", "lfbrhi", "sd1g6g",
    "lly47j", "kac01t", "4a6sgx", "q26dwh", "ugg7w4",
    "zfqi4d", "87xarb",
    "x8r981", "sy45dz", "lrnd8j", "y3hw9j", "3b9dkr",
    "d5ddwl", "yp4j0g", "j4507j", "4cr86p"
];

const VIRTUAL_NODES = 100;

function hash(value) {
    const digest = crypto
        .createHash("sha256")
        .update(value)
        .digest();

    return digest.readUInt32BE(0);
}

function buildRing(shards) {
    const ring = [];

    for (const shard of shards) {
        for (let i = 0; i < VIRTUAL_NODES; i++) {
            ring.push({
                shard,
                position: hash(`SHARD-${shard}-NODE-${i}`)
            });
        }
    }

    return ring.sort((a, b) => a.position - b.position);
}

function getShard(key, ring) {
    const keyPosition = hash(key);

    for (const node of ring) {
        if (keyPosition <= node.position) {
            return node.shard;
        }
    }

    return ring[0].shard;
}

const ring3 = buildRing([1, 2, 3]);
const ring4 = buildRing([1, 2, 3, 4]);

let moved = 0;

for (const key of keys) {
    const oldShard = getShard(key, ring3);
    const newShard = getShard(key, ring4);

    if (oldShard !== newShard) {
        moved++;
    }

    console.log(
        `${key} : Shard ${oldShard} → Shard ${newShard}${
            oldShard !== newShard ? "  MOVED" : ""
        }`
    );
}

console.log("\nResults:");
console.log(`Total keys: ${keys.length}`);
console.log(`Keys moved: ${moved}`);
console.log(
    `Percentage moved: ${((moved / keys.length) * 100).toFixed(2)}%`
);