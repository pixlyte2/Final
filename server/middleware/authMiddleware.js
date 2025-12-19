const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'SECRET123';

const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'Missing token' });
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
module.exports = auth; // 🔥 VERY IMPORTANT