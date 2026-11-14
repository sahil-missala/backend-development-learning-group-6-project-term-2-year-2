const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./trekgear.db");

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON");

    db.run(`
        CREATE TABLE IF NOT EXISTS trekkers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS tents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            size TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'available'
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS rentals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            trekker_id INTEGER NOT NULL,
            tent_id INTEGER NOT NULL,
            rental_date TEXT NOT NULL,
            returned INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (trekker_id) REFERENCES trekkers(id),
            FOREIGN KEY (tent_id) REFERENCES tents(id)
        )
    `);
});

module.exports = db;
