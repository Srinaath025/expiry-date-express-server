const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT from HttpOnly cookie.
 * Attaches decoded user payload to req.user on success.
 */
const protect = (req, res, next) => {
    const token = req.cookies?.jwtToken;

    if (!token) {
        return res.status(401).json({ message: 'Not authenticated. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Session expired or invalid. Please log in again.' });
    }
};

module.exports = { protect };
