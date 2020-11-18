const express = require('express');
const router = express.Router();
const boardController = require('../controllers/board.controller');
const authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware, boardController.getAllBoards);
router.post('/', authMiddleware, boardController.postNewBoard);
router.delete('/:boardId', authMiddleware, boardController.deleteBoard);
router.get('/board-detail/:boardId', boardController.getBoardDetail);
router.post('/board-detail/:boardId', boardController.postCard);
module.exports = router;
