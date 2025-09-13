const timestamp = Math.round(Date.now() /1000);

const data = {
    "game": "spelling_bee",
    "game_data": {
        "answers": [
            "party",
            "parry",
            "poppy",
            "array",
            "pray",
            "harry",
            "patty",
            "ratty",
            "hooray",
            "atrophy",
            "arty",
            "typo",
            "yoohoo",
        ],
        "isRevealed": false
    },
    "puzzle_id": "20239",
    "schema_version": "0.2.5",
    timestamp,
    "user_id": 73876975
};

(async () => {
    try {
        const res = await fetch("https://www.nytimes.com/svc/games/state", {
            "headers": {
                "cookie": "nyt-a=baJJE6TDXrFYzkgG-9NULi; nyt-gdpr=0; nyt-purr=cfshcfhshckfhdfhhgah2taaa; _dd_s=aid=bd9f8200-dcf5-4406-b8c2-d9ece2ad00d3&rum=0&expire=1757707805648; fides_consent=%7B%22consent%22%3A%7B%22targeted_advertising_gpp_us_national%22%3Atrue%7D%2C%22identity%22%3A%7B%22fides_user_device_id%22%3A%226f44ab3a-1f2c-49e2-bc38-d00b3ffdb445%22%7D%2C%22fides_meta%22%3A%7B%22version%22%3A%220.9.0%22%2C%22createdAt%22%3A%222025-09-12T19%3A54%3A45.683Z%22%2C%22updatedAt%22%3A%222025-09-12T19%3A54%3A47.236Z%22%2C%22consentMethod%22%3A%22script%22%7D%2C%22tcf_consent%22%3A%7B%7D%2C%22fides_string%22%3A%22%2C%2CDBABLA~BVQqAAAAAABo.QA%22%7D; nyt-jkidd=uid=73876975&lastRequest=1757706887390&activeDays=%5B0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C1%5D&adv=2&a7dv=1&a14dv=1&a21dv=2&lastKnownType=sub&newsStartDate=&entitlements=XWD; gpp-string=\",,DBABLA~BVQqAAAAAABo.QA\"; nyt-geo=US; regi_cookie=regi_id=73876975; nyt-traceid=00000000000000004c2f212168c3f4a1; NYT-T=ok; nyt-auth-method=username",
                "Referer": "https://www.nytimes.com/puzzles/spelling-bee",
                "content-type": "application/json",
            },
            "body": JSON.stringify(data),
            "method": "POST"
        });
        const json = await res.json();
        console.log(json);
    } catch (e) {
        console.error(e);
    }
})();

