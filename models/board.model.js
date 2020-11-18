const mongooes = require('mongoose');

const Schema = mongooes.Schema;

const boardSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  userId: String,
  totalCards: {
    type: Number,
    required: false,
    default: 0,
  },
  actionCards: {
    type: [String],
    required: false,
  },
  wentCards: {
    type: [String],
    required: false,
  },
  improveCards: {
    type: [String],
    required: false,
  },
  isDelete: {
    type: Boolean,
    required: false,
    default: false,
  },
  createAt: {
    type: Date,
    default: new Date(),
    required: false,
  },
});

const Board = mongooes.model('Board', boardSchema);
module.exports = Board;
