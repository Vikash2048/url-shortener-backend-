import http from "k6/http";
import { check } from "k6";

export const options = {
    vus: 100,
    duration: "30s",
};

export default function () {
    const res = http.get(
        // "http://localhost:3000/api/v1/urls/fnyhy6",
        // "http://localhost:3001/api/v1/urls/fnyhy6",
        // "http://localhost:3002/api/v1/urls/fnyhy6",
        "http://localhost:3003/api/v1/urls/fnyhy6",
        {
            redirects: 0,
        }
    );

    check(res, {
        "status is 302": (r) => r.status === 302,
    });
}