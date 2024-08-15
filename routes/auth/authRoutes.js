
const { Router } = require('express');
const bodyParser = require('body-parser');
const authController = require('../../controllers/authController');

const router = Router();

// Middleware to parse form data
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/login', authController.login_get);

router.post('/login', authController.login_post);

router.get('/signup', authController.signup_get);

router.post('/signup', authController.signup_post);

module.exports = router;
