const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "pass@2024",
    database: "demo",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
    } else {
        console.log("Connected to database.");
    }
});

module.exports = db;
