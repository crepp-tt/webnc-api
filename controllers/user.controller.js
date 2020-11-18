require('dotenv').config();
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.changeProfile = async (req, res) => {
  const { email, name } = req.body;
  const secret = process.env.secret;

  const user = await User.findOneAndUpdate(
    { email: email },
    { name: name },
    { new: true }
  );

  const payload = {
    _id: user._id,
    email: user.email,
    name: user.name,
  };

  jwt.sign(payload, secret, (err, token) => {
    res.status(200).json({
      message: 'Update success',
      token,
    });
  });
};
