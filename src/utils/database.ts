import { Database, verbose } from 'sqlite3';

const sqlite3 = verbose();

export function getDatabase(): Promise<Database> {
  return new Promise((resolve, reject) => {
    const db: Database = new sqlite3.Database('./db/sb.db', (err) => {
      return err ? reject(err) : resolve(db);
    });
  });
}

export function dbRun(
  db: Database,
  query: string,
  params: any[] | any = []
): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err: Error) {
      return err ? reject(err) : resolve(this.lastID);
    });
  });
}

export function dbGetOne<T>(
  db: Database,
  query: string,
  params: any[] | any = []
): Promise<T> {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, rows: T) => {
      return err ? reject(err) : resolve(rows);
    });
  });
}

export function dbGetAll<T>(
  db: Database,
  query: string,
  params: any[] | any = []
): Promise<T> {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows: T) => {
      return err ? reject(err) : resolve(rows);
    });
  });
}
