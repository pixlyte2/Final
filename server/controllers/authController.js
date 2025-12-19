const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'SECRET123';

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ error: 'Email already used' });

    const hash = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hash });

    return res.json({ success: true, message: 'Registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u)
      return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, u.password);
    if (!ok)
      return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: u._id, email: u.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login }; // 🔥 CRITICAL
