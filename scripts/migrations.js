module.exports = [    {
    version: 2,
    queries: [
        'CREATE TABLE IF NOT EXISTS "users" ("id" INTEGER,"username" TEXT,PRIMARY KEY("id" AUTOINCREMENT))',
        'CREATE TABLE IF NOT EXISTS "sessions" ("id" TEXT,"userId" TEXT, "gameId" INTEGER, "words" TEXT,PRIMARY KEY("id"))',
    ]
}
];
