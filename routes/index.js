const router = require('express').Router();
const boardRouter = require('./boards');
const authRouter = require('./auth');
const userRouter = require('./users');

router.use('/boards', boardRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);

module.exports = router;
