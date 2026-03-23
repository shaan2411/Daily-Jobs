const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    // Check Authorization header or cookie
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dailyjobs-jwt-secret');
        req.user = decoded; // { userId, role }
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
};

exports.requireAuthHTML = (req, res, next) => {
    let token = null;
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.redirect('/login?returnTo=' + encodeURIComponent(req.originalUrl));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dailyjobs-jwt-secret');
        req.user = decoded;
        next();
    } catch (err) {
        return res.redirect('/login?returnTo=' + encodeURIComponent(req.originalUrl));
    }
};
