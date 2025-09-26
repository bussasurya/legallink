// backend/middleware/adminAuth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * This middleware first verifies the JWT to ensure a user is logged in.
 * Then, it checks if that logged-in user has the 'admin' role.
 * It's used to protect routes that should only be accessible by administrators.
 */
module.exports = async function (req, res, next) {
    // We use the existing 'auth' middleware first to verify the token,
    // so we can assume req.user exists. This is a common pattern,
    // but for clarity here, we'll combine the logic.

    // 1. Get token from the request header
    const token = req.header('x-auth-token');

    // 2. Check if no token is present
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // 3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        // 4. Find the user in the database to double-check their role
        const user = await User.findById(req.user.id);
        
        // 5. Check if the user is an admin
        if (user && user.role === 'admin') {
            next(); // User is an admin, proceed to the route
        } else {
            return res.status(403).json({ msg: 'Access denied. Not an admin.' });
        }
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};