const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const migrations = require('./migrations');

function getDb() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(
      './db/sb.db',
      sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
      (err) => {
        err ? reject(err) : resolve(db);
      }
    );
  });
}

function getDbVersion(db) {
  return new Promise((resolve, reject) => {
    db.get('PRAGMA user_version;', (err, { user_version }) => {
      err ? reject(err) : resolve(user_version);
    });
  });
}

async function getSetupQueries() {
  const dbSetupQueryString = await fs.promises.readFile('./scripts/db.sql');
  return dbSetupQueryString
    .toString()
    .split('\n')
    .filter((f) => !!f);
}

(async () => {
  try {
    const db = await getDb();
    const setupQueries = await getSetupQueries();
    const dbVersion = await getDbVersion(db);
    console.log('db version at ', dbVersion);
    db.serialize(() => {
      if (dbVersion === 0) {
        console.log('initializing db to version 1 for first use');
        setupQueries.forEach((query) => {
          db.run(query, (err) => {
            err && console.error(err);
          });
        });
        db.run('PRAGMA user_version = 1;');
      }
      if (migrations.length > 0) {
          const newVersion = migrations.reduce((ver, {version, queries}) => {
              if (version > dbVersion) {
                  queries.forEach((query) => {
                      db.run(query, (err) => {
                          err && console.error(err);
                      });
                      db.run(`PRAGMA user_version = ${version}`);
                  });
              }
              return version;
          }, 0);
          console.log(`db updated to version ${newVersion}`);
      }
      db.close(() => {
        console.log(`db ready`);
      });
    });
  } catch (e) {
    console.error(e);
  }
})();
