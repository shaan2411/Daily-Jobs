const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'dailyjobs-jwt-secret',
            { expiresIn: '1d' }
        );

        // Set JWT as cookie for server route protection
        res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });

        const redirectUrl = user.role === 'seeker' ? '/jobs' : '/dashboard';

        res.json({ 
            message: 'Login successful', 
            token,
            user: { 
                _id: user._id.toString(),
                name: user.name,
                email: user.email
            },
            role: user.role,
            redirect: redirectUrl 
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

exports.getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Not authenticated' });
        const user = await User.findById(userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Not authenticated' });
        const { name, phone, address } = req.body;
        const user = await User.findByIdAndUpdate(
            userId, 
            { name, phone, address }, 
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
