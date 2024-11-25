const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// View profile
router.get("/profile", authMiddleware, (req, res) => {
    const userId = req.session.user.id;
    const query = "SELECT first_name, last_name, email, number FROM userdata WHERE id = ?";

    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).send({ error: "Database error" });
        res.status(200).send(results[0]);
    });
});

// Update profile
router.put("/profile", authMiddleware, (req, res) => {
    const userId = req.session.user.id;
    const { first_name, last_name, email, number } = req.body;
    const query = "UPDATE userdata SET first_name = ?, last_name = ?, email = ?, number = ? WHERE id = ?";

    db.query(query, [first_name, last_name, email, number, userId], (err) => {
        if (err) return res.status(500).send({ error: "Failed to update profile" });
        res.status(200).send({ message: "Profile updated successfully" });
    });
});

// Change password
router.put("/change-password", authMiddleware, async (req, res) => {
    const userId = req.session.user.id;
    const { oldPassword, newPassword } = req.body;

    // Check old password
    const query = "SELECT password FROM userdata WHERE id = ?";
    db.query(query, [userId], async (err, results) => {
        if (err || results.length === 0) return res.status(500).send({ error: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, results[0].password);
        if (!isMatch) return res.status(400).send({ error: "Old password is incorrect" });

        // Update to new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updateQuery = "UPDATE userdata SET password = ? WHERE id = ?";
        db.query(updateQuery, [hashedPassword, userId], (err) => {
            if (err) return res.status(500).send({ error: "Failed to update password" });
            res.status(200).send({ message: "Password changed successfully" });
        });
    });
});

module.exports = router;
