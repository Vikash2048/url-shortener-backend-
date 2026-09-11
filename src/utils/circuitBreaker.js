let state = "CLOSED";
let failures = 0;

const FAILURE_THRESHOLD = 3;
const RESET_TIMEOUT = 5000;

export async function circuitBreaker(fn) {
    if (state === "OPEN") {
        throw new Error("Circuit breaker is OPEN");
    }

    try {
        const result = await fn();

        failures = 0;
        state = "CLOSED";

        return result;

    } catch (error) {
        failures++;

        console.log(`Failure count: ${failures}`);

        if (failures >= FAILURE_THRESHOLD) {
            state = "OPEN";

            console.log("Circuit breaker OPEN");

            setTimeout(() => {
                state = "HALF_OPEN";
                console.log("Circuit breaker HALF_OPEN");
            }, RESET_TIMEOUT);
        }

        throw error;
    }
}