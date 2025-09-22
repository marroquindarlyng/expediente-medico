const fs = require("fs");
const DB_PATH = "./src/data/db.json";

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

module.exports = { readDB, writeDB };
