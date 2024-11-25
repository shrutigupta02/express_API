const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

// Register new user
router.post("/register", async (req, res) => {
    const { first_name, last_name, email, password, number } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO userdata (`first_name`, `last_name`, `email`, `password`, `number`) VALUES (?, ?, ?, ?, ?)";

    db.query(query, [first_name, last_name, email, hashedPassword, number], (err, result) => {
        if (err) return res.status(500).send({ error: "Database error" });
        res.status(200).send({ message: "User registered successfully" });
    });
});

// Login user
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM userdata WHERE email = ?";

    db.query(query, [email], async (err, results) => {
        if (err || results.length === 0) return res.status(400).send({ error: "User not found" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send({ error: "Invalid password" });

        req.session.user = { id: user.id, email: user.email }; // Save user in session
        res.status(200).send({ message: "Login successful" });
    });
});

// Logout user
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send({ error: "Logout failed" });
        res.status(200).send({ message: "Logged out successfully" });
    });
});

module.exports = router;
