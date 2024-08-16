const { Router } = require('express');
const bodyParser = require('body-parser');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const router = Router();

router.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Login' })
});

router.get('/signup', (req, res) => {
    res.render('auth/signup', { title: 'Sign Up' })
});


// Middleware to parse form data
router.use(bodyParser.urlencoded());
// Use the cookie parser middleware
router.use(cookieParser());
// HW: read about extended: true

// Signup route POST
router.post('/signup', (req, res) => {
    // 1. Extract the name, email and password from the request body
    const obj = req.body;
    console.log(obj);
    // 2. Create a new user in the database
    User.create(obj)
        .then(user => {
            // 2a. If user is created successfully, create a token,
            // // send it back as cookie, and redirect to all blogs page /blogs
            console.log('User created successfully');
            // TODO: Create a token and send it back as a cookie
            res.redirect('/blogs');
        })
        .catch(err => {
            // 2b. If user creation fails, send an error message with status code 400 (Bad Request)
            console.log(err);
            res.status(400).send(`Error creating user: ${err}`);
        });
});

// Login route POST
router.post('/login', (req, res) => {
    // 1. Extract the email and password from the request body
    const { email, password } = req.body;
    console.log(req.body);
    // 2. Search for the user in the database
    User.findOne({ email })
        .then(user => {
            if (!user) {
                // If user is not found,
                // send an error message with status code 400 (Bad Request)
                return res.status(400).send('User not found');
            }
            else if (user.password !== password) {
                // If password is incorrect,
                // send an error message with status code 400 (Bad Request)
                return res.status(400).send('Incorrect password');
            }
            else {
                // If user is found and password is correct, create a token,
                // // send it back as cookie, and redirect to all blogs page /blogs
                console.log('User logged in successfully');
                // TODO: Create a token and send it back as a cookie
                res.redirect('/blogs');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).send('Error logging in');
        });
});

// HW: Create a logout route and delete the cookie


module.exports = router;


























// // Create a token
// function create_token(email) {
//     const secret = 'veryComplexSecret';
//     return jwt.sign({ email }, secret);
//     // HW: options object
// }