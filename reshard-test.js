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

function getShard(shortCode, shardCount) {
    const hash = crypto
        .createHash("sha256")
        .update(shortCode)
        .digest();

    const number = hash.readUInt32BE(0);

    return (number % shardCount) + 1;
}

let moved = 0;

for (const key of keys) {
    const oldShard = getShard(key, 3);
    const newShard = getShard(key, 4);

    const changed = oldShard !== newShard;

    if (changed) moved++;

    console.log(
        `${key} : Shard ${oldShard} → Shard ${newShard}${changed ? "  MOVED" : ""}`
    );
}

console.log(`\nTotal keys: ${keys.length}`);
console.log(`Keys that would move: ${moved}`);
console.log(
    `Percentage moved: ${((moved / keys.length) * 100).toFixed(2)}%`
);
