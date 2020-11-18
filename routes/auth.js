const router = require('express').Router();
const controller = require('../controllers/auth.controller');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logingg', controller.loginGoogle);
router.post('/loginfb', controller.loginFacebook);

// router.use('/check', authMiddleware);
// router.get('/check', controller.check);

module.exports = router;
