const path = require("path");
const sqlite = require("sqlite3");
const DB_FILE = process.env.DB_FILE || "db.sqlite";

const db = new sqlite.Database(
  path.join(__dirname, DB_FILE),
  sqlite.OPEN_READWRITE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(`Connected to the ${DB_FILE} database.`);
  }
);

function createTables() {
  db.serialize(() => {
    db.run(`
      Create Table if not  EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        user_name Text not null,
        user_email TEXT NOT NULL UNIQUE,
        user_profile_image Text ,
        user_hash_password Blob NOT NULL,
        user_salt Blob NOT NULL,
        user_created_at TEXT NOT NULL,
        user_updated_at TEXT NOT NULL
      )
    `);
    db.run(`
      Create TABLE IF NOT EXISTS federated_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        user_first_name TEXT NOT NULL,
        user_last_name TEXT NOT NULL,
        provider TEXT NOT NULL,
        user_email TEXT NOT NULL UNIQUE,
        user_created_at TEXT NOT NULL,
        user_updated_at TEXT NOT NULL
      )
    `);
    db.run(`
      Create TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL UNIQUE,
        task_type TEXT NOT NULL,
        task_description TEXT,
        task_important INTEGER NOT NULL,
        task_completed INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
        )
    `);
    db.run(`
      Create TABLE IF NOT EXISTS user_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        task_id INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (user_id),
        FOREIGN KEY (task_id) REFERENCES tasks (task_id)
      )
    `);
  });
}

createTables();

module.exports = db;
