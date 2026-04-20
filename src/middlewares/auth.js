const jwt = require('jsonwebtoken');
const userModel = require('../models/User');
require('dotenv').config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
	return res.status(401).json({ message: 'please login first' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
	return res.status(401).json({ message: 'Invalid Authorization header format' });
  }

  const token = parts[1];

  try {
	const payload = jwt.verify(token, process.env.secret_key);
	const user = await userModel.findById(payload.userId);
	if (!user) return res.status(401).json({ message: 'User not found' });


	user.password = undefined;  

	req.user = user;
	next();
  } catch (err) {
	return res.status(401).json({ message: err.message });
  }
};



module.exports = verifyToken