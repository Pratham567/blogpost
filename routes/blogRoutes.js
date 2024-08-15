const express = require('express');
const bodyParser = require('body-parser');
const BlogPost = require('../models/blogpost');
const blogController = require('../controllers/blogController');

const router = express.Router();


router.get('/form', (req, res) => {
    res.render('blogs/newblog', { title: 'New blog' });
});

router.get('/success', (req, res) => {
    res.render('blogs/success', { title: 'Success' });
});

router.get('/fail', (req, res) => {
    res.render('blogs/fail', { title: 'Failed' });
});

// // blog routes
// Middleware to parse form data
router.use(bodyParser.urlencoded({ extended: true }));

// GET request to view all blogs
router.get('/', blogController.blog_index_get);

// New route to view a single blog post
router.get('/id/:id', blogController.blog_id_get);

// POST request to create a new blog
router.post('/',blogController.blog_create_post);

// DELETE request to delete a blog
router.delete('/id/:id', blogController.blog_delete);

module.exports = router;
