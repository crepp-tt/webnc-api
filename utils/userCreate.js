require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const faker = require('faker');
faker.locale = 'vi';

mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
    console.log('Connect successfully!!');

    let user = new User({
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: faker.internet.password(),
    });

    user.save(function (err) {
      if (err) throw err;
      console.log('Comment successfully saved.');
    });
  }
);
