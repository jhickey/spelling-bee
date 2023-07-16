const {verbose} = require('sqlite3');

const sqlite3 = verbose();

function getDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./db/sb.db', (err) => {
            return err ? reject(err) : resolve(db);
        });
    });
}

function dbRun(
    db,
    query,
    params
) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            return err ? reject(err) : resolve(this.lastID);
        });
    });
}

(async () => {
    try {
        const response = await fetch(
            'https://www.nytimes.com/puzzles/spelling-bee'
        );
        const text = await response.text();
        const startIndex = text.indexOf('gameData') + 11;
        const endIndex = text.indexOf('}}', text.indexOf('gameData')) + 2;
        const data = JSON.parse(text.slice(startIndex, endIndex));
        const {
            today: {id, answers, validLetters, centerLetter, printDate},
        } = data;
        const db = await getDatabase();
        await dbRun(
            db,
            'INSERT OR REPLACE INTO games (id, answers, letters, center_letter, date) VALUES (?, ?, ?, ?, ?)',
            [
                id,
                JSON.stringify(answers),
                JSON.stringify(validLetters),
                centerLetter,
                printDate,
            ]
        );
        console.log(`pulled game for ${printDate}`);
    } catch (e) {
        console.error(e);
    }
})();
