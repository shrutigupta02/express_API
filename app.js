const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

//database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass@2024',
    database: 'demo',
});

//database connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

//CREATE ROUTE
app.post('/add', (req, res) => {
    const query = 'INSERT INTO assignment (`first_name`, `last_name`, `email`, `password`, `number`) VALUES (?)';
    const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.password,
        req.body.number
    ];

    db.query(query, [values], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ error: 'Database query error' });
            return;
        }

        console.log(result);
        res.status(200).send({ message: 'User registered successfully' });
    });
});

// SHOW ROUTE
app.get('/show', (req, res) => {
    const query = `SELECT * FROM assignment`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).send({ error: 'Database query error' });
            return;
        }

        // Send results as JSON
        res.status(200).json(results);
    });
});


app.listen(1234, ()=>{
    console.log("app listening on port 1234");
});