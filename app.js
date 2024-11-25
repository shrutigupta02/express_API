const express = require('express');
const mysql = require('mysql2');
const session = require('express-session'); // Import express-session
const bodyParser = require('body-parser');
const cors = require('cors'); // For enabling CORS
const app = express();

// Middleware for CORS (allow requests from your React frontend)
app.use(cors({
    origin: 'http://localhost:5173', // Your React app URL
    credentials: true,  // Allow cookies to be sent along with the request
}));

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure express-session
app.use(session({
    secret: 'your-secret-key',  // Change this to a secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,  // Set to true if you're using HTTPS
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

// Assuming you are using Express.js

// Route to get user profile
// Example of setting the session data after login
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Check user credentials (using a database query)
    const user = getUserByEmailAndPassword(email, password); // Replace with actual logic

    if (user) {
        req.session.user = { id: user.id, email: user.email };  // Set session data
        return res.json({ message: 'Login successful!' });
    } else {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.get('/user/profile', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not authenticated' }); // Return 401 if not authenticated
    }

    // Fetch user profile from database (use session data to find user)
    const user = getUserById(req.session.user.id);  // Replace with actual DB query

    if (user) {
        res.json(user);  // Return the user data
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});


// Route to update user profile
app.put('/user/profile', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    // Update user profile in database (e.g., MySQL)
    const { firstName, lastName, email, number } = req.body;
    updateUserProfile(req.session.user.id, { firstName, lastName, email, number });  // Replace with actual DB call
    res.json({ message: 'Profile updated successfully' });
});

// Route to change password
app.put('/user/change-password', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const { oldPassword, newPassword } = req.body;
    // Verify old password, change to new password in DB
    const success = changePassword(req.session.user.id, oldPassword, newPassword); // Replace with actual DB call
    if (success) {
        res.json({ message: 'Password changed successfully' });
    } else {
        res.status(400).json({ error: 'Failed to change password' });
    }
});


// Start server
app.listen(1234, () => {
    console.log("Server running on http://localhost:1234");
});
