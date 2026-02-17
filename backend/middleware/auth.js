// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // --- THIS IS THE KEY ---
        // We expect the token's payload to have a "user" object
        // This line adds that "user" object to the request
        req.user = decoded.user; 
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};