require('dotenv').config();
const mongoose = require('mongoose');
const Board = require('../models/board.model');
const faker = require('faker');

mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
    console.log('Connect successfully!!');

    let board = new Board({
      title: faker.name.title(),
      totalCards: 8,
      actionCards: [
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
      ],
      wentCards: [faker.lorem.sentence()],
      improveCards: [
        faker.lorem.sentence(),
        faker.lorem.sentence(),
        faker.lorem.sentence(),
      ],
    });

    board.save(function (err) {
      if (err) throw err;
      console.log('Comment successfully saved.');
    });
  }
);
