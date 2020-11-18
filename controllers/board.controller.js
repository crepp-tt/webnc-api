const Board = require('../models/board.model');
require('dotenv').config();
let jwt = require('jsonwebtoken');

exports.getAllBoards = (req, res) => {
  const token = req.headers.token;
  if (token) {
    const payload = jwt.verify(token, process.env.secret, {
      ignoreExpiration: true,
    });
    Board.find({ userId: payload._id }).then((boards) => {
      res.status(201).send(boards);
    });
  }

  res.status(403);
};

exports.postNewBoard = (req, res) => {
  const { title } = req.body;
  const token = req.headers.token;
  if (token) {
    const payload = jwt.verify(token, process.env.secret, {
      ignoreExpiration: true,
    });
    let board = new Board({
      title: title,
      totalCards: 0,
      actionCards: [],
      wentCards: [],
      improveCards: [],
      userId: payload._id,
    });

    board.save(function (err) {
      if (err) throw err;
      console.log('Comment successfully saved.');
    });
    res.status(201).json({ _id: board._id });
  }
  res.status(403);
};

exports.deleteBoard = async (req, res) => {
  const { boardId } = req.params;
  const filter = {
    _id: boardId,
  };
  const update = {
    isDelete: true,
  };

  try {
    await Board.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.status(204).json({
      message: 'Delete success',
    });
  } catch (error) {
    res.status(400).json({
      message: 'Can not delete',
    });
  }
};

exports.getBoardDetail = (req, res) => {
  const { boardId } = req.params;

  //check boardId
  const check = (board) => {
    if (!board) throw new Error('Not found');
    else return board;
  };

  //respond board
  const respond = (board) => {
    res.status(200).json({
      board,
    });
  };

  //error occured
  const onError = (error) => {
    res.status(403).json({
      message: error.message,
    });
  };

  Board.findById(boardId).then(check).then(respond).catch(onError);
};

exports.postCard = async (req, res) => {
  const { board } = req.body;
  console.log(board);
  const id = board._id;
  delete board._id;
  delete board.__v;
  delete board.createAt;
  try {
    Board.updateOne({ _id: id }, { $set: board }).then(console.log(board));

    res.status(204).json({ message: 'Edit success' });
  } catch (error) {
    res.status(400).json({ message: 'Can not edit' });
  }
};
