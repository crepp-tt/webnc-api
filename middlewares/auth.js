const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // read the token from header or url
  const token = req.headers.token || req.query.token;
  console.log(token);

  // token does not exist
  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'not logged in',
    });
  }

  // create a promise that decodes the token
  const p = new Promise((resolve, reject) => {
    jwt.verify(token, process.env.secret, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });

  // if it has failed to verify, it will return an error message
  const onError = (error) => {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  };

  // process the promise
  p.then((decoded) => {
    req.decoded = decoded;
    next();
  }).catch(onError);
};

module.exports = authMiddleware;
