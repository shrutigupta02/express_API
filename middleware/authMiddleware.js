function authMiddleware(req, res, next) {
    if (req.session.user) {
        next(); // User is authenticated
    } else {
        res.status(401).send({ error: "Unauthorized access" });
    }
}

module.exports = authMiddleware;
