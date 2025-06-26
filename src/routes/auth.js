const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validate = require('../middleware/validate');
const { register, login } = require('../utils/validators/userValidator');
const router = express.Router();

router.post('/register', validate(register), async (req, res) => {
  const { username, password, role } = req.body;
  if (!['jobseeker', 'employer'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword, role });
    res.status(201).json({ 
      message: 'User registered', 
      username: user.username,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

router.post('/login', validate(login), async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, username: user.username });
});

module.exports = router;  