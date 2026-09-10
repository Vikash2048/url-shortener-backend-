import http from "k6/http";
import { check } from "k6";

export const options = {
    vus: 10,
    duration: "30s",
};

export default function () {
    // const res = http.post(
    //     "http://localhost:3000/api/v1/urls/shorten",
    //     JSON.stringify({
    //         url: "www.yahoo.com",
    //     }),
    //     {
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         redirects: 0,
    //     }
    // );

        const res = http.get(
        // "http://localhost:3000/api/v1/urls/bbvap6",
        // "http://localhost:3001/api/v1/urls/fnyhy6",
        // "http://localhost:3002/api/v1/urls/fnyhy6",
        // "http://localhost:3003/api/v1/urls/fnyhy6",
        "http://localhost:3000/api/v1/urls/4zsrmc",
        {
            redirects: 0,
        }
    );

    check(res, {
        "status is 302": (r) => r.status === 302,
    });
}