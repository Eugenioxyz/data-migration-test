const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY,
    department TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY,
    job TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS hired_employees (
    id INTEGER PRIMARY KEY,
    name TEXT,
    datetime TEXT,
    department_id INTEGER,
    job_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
  )
`);

module.exports = db;
