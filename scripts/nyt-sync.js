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
                "cookie": "nyt-a=oM4OdotY7ccTh3NgoeqzQb; NYT-T=ok; nyt-auth-method=username; _cb=DAWahCClq_iH_loYS; iter_id=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhaWQiOiI2NDFlMWJiYzc5ZjRmODAwMDE1MTRkYTkiLCJjb21wYW55X2lkIjoiNWMwOThiM2QxNjU0YzEwMDAxMmM2OGY5IiwiaWF0IjoxNjc5Njk0NzgwfQ.EoVbvMtmbIwSPOV1InmfWatiEJ3llPn2yxE6ZOy96PA; nyt-purr=cfhhcfhhhckfhdfs; _gcl_au=1.1.1355206993.1687621903; purr-cache=<K0<rUS-NY<C_<G_<S0<a0; nyt-xwd-hashd=false; nyt-gdpr=0; nyt-geo=US; nyt-us=1; nyt-b3-traceid=305d515e42124ba6bc7abc3f58f18a18; __gads=ID=2bfb5309a3bc0648:T=1679694780:RT=1689021399:S=ALNI_MYz1uE82Bw1YrnQp403cTd3XdRAkg; __gpi=UID=0000096609fbd080:T=1679694780:RT=1689021399:S=ALNI_MYK7M-BJSladsEp47-2ZdiLJLB84w; nyt-jkidd=uid=73876975&lastRequest=1689033433154&activeDays=%5B0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C1%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C0%2C1%5D&adv=3&a7dv=1&a14dv=2&a21dv=3&lastKnownType=sub&newsStartDate=&entitlements=XWD; _chartbeat2=.1679694780520.1689033433268.0001000000000001.CtNKnlBxCknnBRKVGDLvbUICRhYrR.1; _cb_svref=null; nyt-m=2D905563D6B8FF3683B6DF9A7C3D5701&uuid=s.33d7eafd-efb4-4a4f-a9ab-b69b87590822&igu=i.1&igf=i.0&s=s.spelling_bee&v=i.0&n=i.2&g=i.0&iir=i.0&t=i.0&prt=i.0&imv=i.0&ira=i.0&vp=i.0&ft=i.0&fv=i.0&ird=i.0&iru=i.1&e=i.1690898400&er=i.1689033433&ica=i.0&iue=i.1&ifv=i.0&rc=i.0&pr=l.4.0.0.0.0&cav=i.0&imu=i.1&igd=i.0&iga=i.0&vr=l.4.0.0.0.0&ier=i.0&iub=i.0; _SUPERFLY_lockout=1; datadome=Alz6Ut~9pbbIdr8cnAjoeRu-o7EFgIFNjKD6A2p-hD--oGSE87RiWx-OCOSeYq0nBgL7MGaNTdFSE8ms8LNYTk1twvs4W3ATHkXlIV1M-hTf5dKPmqn1PsZYYbdddSo; SIDNY=CBQSLwizotykBhDBubKlBhoSMS3NLCGvoKFyq7CBeyiJ67qXIO-LnSMqAgACOOvpgrQFGkAloIkh2bokkg5Qf9JBQFltEclDmu-nckwYLiOeYivTjntVpLd-ZP1Dyne9n-WznXqVMi7NZGw54oRfCv6PZFgH; NYT-S=1wjGlvMmNgXkgZgu56xmCT74unoMF9qhbJ4UFWLA/WCropCyGuI2Reas31.E/yWpQFjOoea6bgYnRxckKfk3fLpzAU7gQRI01P9dw/MVXrw6jwwgcYPc44GjxDTQO38FS1^^^^CBQSLwizotykBhDBubKlBhoSMS3NLCGvoKFyq7CBeyiJ67qXIO-LnSMqAgACOOvpgrQFGkAloIkh2bokkg5Qf9JBQFltEclDmu-nckwYLiOeYivTjntVpLd-ZP1Dyne9n-WznXqVMi7NZGw54oRfCv6PZFgH",
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

