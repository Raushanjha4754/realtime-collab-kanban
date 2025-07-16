const User = require('../models/User')
const bcrypt = require('bcryptjs') 
const jwt = require('jsonwebtoken')

// Register
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body; // ✅ Accept role

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user' // ✅ Default to 'user' if role is not provided
        });

        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password, role } = req.body; // ✅ Accept role in request

    try {
        const user = await User.findOne({ email, role }); // ✅ Match both email & role

        if (!user) return res.status(400).json({ message: 'Invalid email, role, or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email, role, or password' });

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '2d' },
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};




// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('_id username email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to get users', error: err.message });
  }
};