const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { name, email, phone, address, password, role } = req.body;
        let addressProof = null;

        if (req.file) {
            addressProof = req.file.path;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name, email, phone, address, password: hashedPassword, role, addressProof
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ email, role });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email, password, or role' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email, password, or role' });
        }

        // Set a session or simple cookie for authentication
        req.session.userId = user._id;
        req.session.role = user.role;

        res.json({ message: 'Login successful', role: user.role, userId: user._id });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'Could not log out' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
};

exports.getProfile = async (req, res) => {
    try {
        if (!req.session.userId) return res.status(401).json({ error: 'Not authenticated' });
        const user = await User.findById(req.session.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
