// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

/**
 * This middleware function checks for a valid JSON Web Token (JWT) in the
 * 'x-auth-token' header of an incoming request. If the token is valid,
 * it decodes the user information from the token and attaches it to the
 * request object (req.user) before passing control to the next route handler.
 * If the token is missing or invalid, it sends a 401 (Unauthorized) response.
 */
module.exports = function (req, res, next) {
    // 1. Get token from the request header
    const token = req.header('x-auth-token');

    // 2. Check if no token is present
    if (!token) {
        // If there's no token, the user is unauthorized
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 3. Verify the token if it exists
    try {
        // Decode the token using the secret key from your .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the user payload from the token to the request object
        // This makes the user's ID and role available in all subsequent protected routes
        req.user = decoded.user;
        
        // Pass control to the next function in the middleware chain (or the final route handler)
        next();
    } catch (err) {
        // If the token is not valid (e.g., expired or tampered with), send an error
        res.status(401).json({ msg: 'Token is not valid' });
    }
};