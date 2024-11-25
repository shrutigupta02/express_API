const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();

// Middleware for CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure express-session
app.use(session({
    secret: 'abcdef',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass@2024', // Your MySQL password
    database: 'demo', // Your database name
});

// Test MySQL connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to database.');
});

// User login route
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    const query = 'SELECT * FROM assignment WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Set session data
        req.session.user = { id: user.id, email: user.email };

        return res.status(200).json({ message: 'Login successful', user });
    });
});

// Register Route (POST /add)
app.post('/add', (req, res) => {
    const { first_name, last_name, email, password, number } = req.body;
    
    // Check if the data is provided
    if (!first_name || !last_name || !email || !password || !number) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const query = 'INSERT INTO assignment (first_name, last_name, email, password, number) VALUES (?, ?, ?, ?, ?)';
    const values = [first_name, last_name, email, password, number];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database query error' });
        }

        res.status(200).json({ message: 'User registered successfully' });
    });
});


// Start server
app.listen(1234, () => {
    console.log("Server running on http://localhost:1234");
});
