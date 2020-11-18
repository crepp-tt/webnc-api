require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const got = require('got');

/*
    POST /api/auth/register
    {
        email,
        name,
        password
    }
*/
exports.register = (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ message: 'Please input all fields.' });
  let newUser = null;

  const create = (user) => {
    if (user) {
      throw new Error('Email already exists');
    } else {
      return User.create(email, name, password);
    }
  };

  const respond = (isAdmin) => {
    res.status(201).json({
      message: 'Create account successfully',
    });
  };

  // run when there is an error (username exists)
  const onError = (error) => {
    res.status(409).json({
      message: error.message,
    });
  };

  User.findOneByEmail(email).then(create).then(respond).catch(onError);
};

/*
    POST /api/auth/login
    {
        email,
        password
    }
*/

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Please input all fields.' });
  const secret = process.env.secret;

  //check user info & generate the jwt
  const check = (user) => {
    if (!user) {
      //user not exists
      throw new Error('Login failed');
    } else {
      //user exists, check password
      if (user.verify(password)) {
        const payload = {
          _id: user._id,
          email: user.email,
          name: user.name,
        };
        // create a promise that generates jwt asynchronously
        const p = new Promise((resolve, reject) => {
          jwt.sign(payload, secret, (err, token) => {
            if (err) reject(err);
            resolve(token);
          });
        });
        return p;
      } else {
        throw new Error('Login failed');
      }
    }
  };

  //respond token
  const respond = (token) => {
    res.status(200).json({
      message: 'Login successfully',
      token,
    });
  };

  //error occured
  const onError = (error) => {
    res.status(403).json({
      message: error.message,
    });
  };

  //find user
  User.findOneByEmail(email).then(check).then(respond).catch(onError);
};

exports.loginGoogle = async (req, res) => {
  const { ggAccessToken } = req.body;
  if (!ggAccessToken) {
    return res.status(404).json({
      message: 'Cannot found the google access token.',
    });
  }

  try {
    const query = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${ggAccessToken}`;
    const response = await got(`${query}`).json();
    const user = await User.findOne({
      $or: [{ ggID: response.sub }, { email: response.email }],
    });
    if (user) {
      const payload = {
        _id: user._id,
        email: user.email,
        name: user.name,
      };

      const token = jwt.sign(payload, process.env.secret);
      return res.status(200).json({ message: 'Login successfully', token });
    }
    const newUser = await User.createWithGoogleID(
      response.sub,
      response.email,
      response.name
    );

    const payload = {
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    };

    const token = jwt.sign(payload, process.env.secret);
    return res.status(200).json({ message: 'Login successfully', token });
  } catch (error) {
    return res.status(500);
  }
};

exports.loginFacebook = async (req, res) => {
  const { fbAccessToken, id } = req.body;
  if (!fbAccessToken || !id) {
    return res.status(404).json({
      message: 'Cannot found the facebook access token.',
    });
  }

  try {
    const query = `https://graph.facebook.com/${id}?fields=birthday,email,picture,name&access_token=${fbAccessToken}`;
    const response = await got(`${query}`).json();
    const user = await User.findOne({
      $or: [{ fbID: response.id }, { email: response.email }],
    });
    if (user) {
      const payload = {
        _id: user._id,
        email: user.email,
        name: user.name,
      };

      const token = jwt.sign(payload, process.env.secret);

      return res.status(200).json({ message: 'Login successfully', token });
    }
    const newUser = await User.createWithFacebookID(
      response.id,
      response.email,
      response.name
    );

    const payload = {
      _id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    };

    const token = jwt.sign(payload, process.env.secret);
    console.log(token);
    return res.status(200).json({ message: 'Login successfully', token });
  } catch (error) {
    return res.status(500);
  }
};
