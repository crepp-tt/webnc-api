require('dotenv').config();
const mongooes = require('mongoose');
const crypto = require('crypto');
const Schema = mongooes.Schema;

let User = new Schema({
  email: { type: String, unique: true },
  name: { type: String },
  password: { type: String },
  fbID: { type: String },
  ggID: { type: String },
});

//create new user
User.statics.create = function (email, name, password) {
  const encrypted = crypto
    .createHmac('sha1', process.env.secret)
    .update(password)
    .digest('base64');
  const user = new this({
    email: email,
    name: name,
    password: encrypted,
  });
  return user.save();
};

//create new user with googleID
User.statics.createWithGoogleID = function (googleID, email, name) {
  const user = new this({
    ggID: googleID,
    email: email,
    name: name,
  });
  return user.save();
};

//create new user with facebookID
User.statics.createWithFacebookID = function (facebookID, email, name) {
  const user = new this({
    fbID: facebookID,
    email: email,
    name: name,
  });
  return user.save();
};

//find one user by email
User.statics.findOneByEmail = function (email) {
  return this.findOne({
    email,
  }).exec();
};

//verify password of user
User.methods.verify = function (password) {
  const encrypted = crypto
    .createHmac('sha1', process.env.secret)
    .update(password)
    .digest('base64');
  console.log(this.password === encrypted);

  return this.password === encrypted;
};

module.exports = mongooes.model('User', User);
